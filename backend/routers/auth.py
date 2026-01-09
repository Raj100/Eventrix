from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta
import bcrypt
from bson import ObjectId
from models import UserCreate, UserLogin, UserResponse, UserUpdate
from core.db import get_db
from core.security import create_access_token, create_refresh_token, get_current_user, verify_token

router = APIRouter()

async def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

@router.post("/register")
async def register(user: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Register a new user with email, password, name and phone"""
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = await hash_password(user.password)
    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "phone": user.phone,
        "role": "user",
        "address": "",
        "city": "",
        "state": "",
        "pincode": "",
        "email_notifications": True,
        "sms_notifications": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    result = await db.users.insert_one(user_data)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    
    return {
        "user_id": user_id,
        "email": user.email,
        "name": user.name,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": "user"
    }

@router.post("/login")
async def login(credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """User login with email and password"""
    user = await db.users.find_one({"email": credentials.email})
    if not user or not await verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user_id = str(user["_id"])
    
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    
    return {
        "user_id": user_id,
        "email": user["email"],
        "name": user["name"],
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": user.get("role", "user")
    }

@router.post("/admin/login")
async def admin_login(credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin login with email and password - only for admin role users"""
    user = await db.users.find_one({"email": credentials.email})
    if not user or user.get("role") != "admin" or not await verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials"
        )
    
    user_id = str(user["_id"])
    
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    
    return {
        "user_id": user_id,
        "email": user["email"],
        "name": user["name"],
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "role": "admin"
    }

@router.post("/refresh")
async def refresh_access_token(refresh_token: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Refresh access token using refresh token"""
    payload = verify_token(refresh_token, "refresh")
    user_id = payload.get("sub")
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    access_token = create_access_token({"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current logged-in user profile"""
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "phone": current_user["phone"],
        "role": current_user.get("role", "user"),
        "address": current_user.get("address", ""),
        "city": current_user.get("city", ""),
        "state": current_user.get("state", ""),
        "pincode": current_user.get("pincode", ""),
        "email_notifications": current_user.get("email_notifications", True),
        "sms_notifications": current_user.get("sms_notifications", False),
        "created_at": current_user.get("created_at"),
    }

@router.put("/profile")
async def update_profile(update: UserUpdate, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Update current user profile"""
    update_data = update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.users.update_one(
        {"_id": ObjectId(str(current_user["_id"]))},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"_id": ObjectId(str(current_user["_id"]))})
    
    return {
        "id": str(updated_user["_id"]),
        "name": updated_user["name"],
        "email": updated_user["email"],
        "phone": updated_user["phone"],
        "address": updated_user.get("address", ""),
        "city": updated_user.get("city", ""),
        "state": updated_user.get("state", ""),
        "pincode": updated_user.get("pincode", ""),
        "email_notifications": updated_user.get("email_notifications", True),
        "sms_notifications": updated_user.get("sms_notifications", False),
    }

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user - invalidation handled on frontend by removing tokens"""
    return {"message": "Logged out successfully"}
