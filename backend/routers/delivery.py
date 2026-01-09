from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from models import DeliveryCharges, DeliveryChargesUpdate
from core.db import get_db
from core.security import get_admin_user

router = APIRouter()

@router.get("/charges/{pincode}")
async def get_delivery_charge(pincode: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    delivery = await db.delivery_charges.find_one({"pincode": pincode})
    if not delivery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Delivery not available for this pincode")
    
    return {
        "pincode": delivery["pincode"],
        "charge": delivery["charge"],
        "delivery_days": delivery.get("delivery_days", 3)
    }

@router.get("/charges")
async def get_all_charges(db: AsyncIOMotorDatabase = Depends(get_db)):
    charges = []
    async for charge in db.delivery_charges.find():
        charge["id"] = str(charge["_id"])
        charges.append(charge)
    
    return charges

@router.post("/charges")
async def set_delivery_charges(data: DeliveryChargesUpdate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    for charge in data.charges:
        await db.delivery_charges.update_one(
            {"pincode": charge.pincode},
            {
                "$set": {
                    "charge": charge.charge,
                    "delivery_days": charge.delivery_days,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
    
    return {"message": f"Updated {len(data.charges)} delivery charges"}
