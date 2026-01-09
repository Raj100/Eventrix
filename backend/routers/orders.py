from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from models import OrderCreate, OrderResponse
from core.db import get_db
from core.security import get_current_user

router = APIRouter()

@router.post("/")
async def create_order(order: OrderCreate, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in order.items)
    tax = round(subtotal * 0.18)  # 18% GST
    
    # Get delivery charge
    delivery_charge = 0
    delivery_info = await db.delivery_charges.find_one({"pincode": order.pincode})
    if delivery_info:
        delivery_charge = delivery_info["charge"]
    
    total = subtotal + tax + delivery_charge
    
    order_data = {
        "user_id": str(current_user["_id"]),
        "items": [item.dict() for item in order.items],
        "shipping_address": order.shipping_address,
        "pincode": order.pincode,
        "payment_method": order.payment_method,
        "status": "pending",
        "subtotal": subtotal,
        "tax": tax,
        "delivery_charge": delivery_charge,
        "total": total,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    result = await db.orders.insert_one(order_data)
    
    return {
        "id": str(result.inserted_id),
        **order_data
    }

@router.get("/")
async def get_orders(current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    orders = []
    async for order in db.orders.find({"user_id": str(current_user["_id"])}):
        order["id"] = str(order["_id"])
        orders.append(order)
    
    return orders

@router.get("/{order_id}")
async def get_order(order_id: str, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        order_obj_id = ObjectId(order_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order ID")
    
    order = await db.orders.find_one({"_id": order_obj_id})
    
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    if order["user_id"] != str(current_user["_id"]) and current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")
    
    order["id"] = str(order["_id"])
    return order

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status: str, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    
    try:
        order_obj_id = ObjectId(order_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order ID")
    
    await db.orders.update_one(
        {"_id": order_obj_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    updated_order = await db.orders.find_one({"_id": order_obj_id})
    updated_order["id"] = str(updated_order["_id"])
    return updated_order
