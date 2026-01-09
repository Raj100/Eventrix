from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from models import UserUpdate
from core.db import get_db
from core.security import get_admin_user, get_current_user


router = APIRouter()

@router.get("/")
async def get_all_users(current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin only: Get all users with stats"""
    users = []
    async for user in db.users.find({}).sort("created_at", -1):
        users.append({
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "role": user.get("role", "user"),
            "address": user.get("address"),
            "city": user.get("city"),
            "state": user.get("state"),
            "pincode": user.get("pincode"),
            "created_at": user.get("created_at"),
            "updated_at": user.get("updated_at"),
        })
    return users

@router.get("/stats")
async def get_user_stats(current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin only: Get user statistics"""
    total_users = await db.users.count_documents({})
    admin_users = await db.users.count_documents({"role": "admin"})
    user_users = await db.users.count_documents({"role": "user"})
    designer_users = await db.users.count_documents({"role": "designer"})
    
    # Count active users (logged in last 7 days) - simplified version
    from datetime import timedelta
    week_ago = datetime.utcnow() - timedelta(days=7)
    active_users = await db.users.count_documents({"updated_at": {"$gte": week_ago}})
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "admin_count": admin_users,
        "user_count": user_users,
        "designer_count": designer_users,
    }

@router.get("/{user_id}")
async def get_user(user_id: str, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin only: Get specific user details"""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "role": user.get("role", "user"),
        "address": user.get("address"),
        "city": user.get("city"),
        "state": user.get("state"),
        "pincode": user.get("pincode"),
        "email_notifications": user.get("email_notifications", True),
        "sms_notifications": user.get("sms_notifications", False),
        "created_at": user.get("created_at"),
        "updated_at": user.get("updated_at"),
    }

@router.put("/{user_id}")
async def update_user(user_id: str, update: UserUpdate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin only: Update user information"""
    try:
        user_obj_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    update_data = update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.users.update_one(
        {"_id": user_obj_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    updated_user = await db.users.find_one({"_id": user_obj_id})
    
    return {
        "id": str(updated_user["_id"]),
        "name": updated_user.get("name"),
        "email": updated_user.get("email"),
        "phone": updated_user.get("phone"),
        "role": updated_user.get("role", "user"),
        "address": updated_user.get("address"),
        "city": updated_user.get("city"),
        "state": updated_user.get("state"),
        "pincode": updated_user.get("pincode"),
        "updated_at": updated_user.get("updated_at"),
    }

@router.delete("/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin only: Delete a user"""
    try:
        user_obj_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")
    
    # Prevent deleting yourself
    if str(current_user["_id"]) == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete your own account")
    
    result = await db.users.delete_one({"_id": user_obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return {"message": "User deleted successfully"}
