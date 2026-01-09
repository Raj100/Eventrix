from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from models import PaymentInitiate, PaymentVerify
from core.db import get_db
from core.security import get_current_user
import uuid

router = APIRouter()

@router.post("/initiate")
async def initiate_payment(payment: PaymentInitiate, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    # Verify order belongs to user
    try:
        order_id = ObjectId(payment.order_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order ID")
    
    order = await db.orders.find_one({"_id": order_id})
    if not order or order["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")
    
    # Mock payment gateway - in production use Razorpay, Stripe, etc.
    transaction_id = str(uuid.uuid4())
    
    payment_data = {
        "order_id": payment.order_id,
        "user_id": str(current_user["_id"]),
        "amount": payment.amount,
        "payment_method": payment.payment_method,
        "transaction_id": transaction_id,
        "status": "initiated",
        "created_at": datetime.utcnow(),
    }
    
    result = await db.payments.insert_one(payment_data)
    
    return {
        "payment_id": str(result.inserted_id),
        "transaction_id": transaction_id,
        "order_id": payment.order_id,
        "amount": payment.amount,
        "payment_method": payment.payment_method,
    }

@router.post("/verify/{order_id}")
async def verify_payment(order_id: str, payment: PaymentVerify, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        order_obj_id = ObjectId(order_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid order ID")
    
    order = await db.orders.find_one({"_id": order_obj_id})
    if not order or order["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")
    
    # Update payment status
    await db.payments.update_one(
        {"transaction_id": payment.transaction_id},
        {"$set": {"status": payment.status, "verified_at": datetime.utcnow()}}
    )
    
    # If payment successful, update order status
    if payment.status == "success":
        await db.orders.update_one(
            {"_id": order_obj_id},
            {"$set": {"status": "confirmed", "paid_at": datetime.utcnow(), "updated_at": datetime.utcnow()}}
        )
    
    return {
        "order_id": order_id,
        "transaction_id": payment.transaction_id,
        "payment_status": payment.status,
        "order_status": "confirmed" if payment.status == "success" else "pending"
    }
