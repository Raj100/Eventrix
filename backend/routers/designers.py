from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from models import DesignerCreate, DesignerUpdate
from core.db import get_db
from core.security import get_admin_user, get_current_user

router = APIRouter()

@router.get("/")
async def get_designers(db: AsyncIOMotorDatabase = Depends(get_db)):
    designers = []
    async for designer in db.designers.find():
        designer["id"] = str(designer["_id"])
        designers.append(designer)
    
    return designers

@router.post("/")
async def create_designer(designer: DesignerCreate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    designer_data = designer.dict()
    designer_data["created_at"] = datetime.utcnow()
    designer_data["updated_at"] = datetime.utcnow()
    
    result = await db.designers.insert_one(designer_data)
    
    return {
        "id": str(result.inserted_id),
        **designer_data
    }

@router.put("/{designer_id}")
async def update_designer(designer_id: str, designer: DesignerUpdate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        designer_obj_id = ObjectId(designer_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid designer ID")
    
    designer_data = designer.dict()
    designer_data["updated_at"] = datetime.utcnow()
    
    result = await db.designers.update_one(
        {"_id": designer_obj_id},
        {"$set": designer_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Designer not found")
    
    updated_designer = await db.designers.find_one({"_id": designer_obj_id})
    updated_designer["id"] = str(updated_designer["_id"])
    return updated_designer

@router.delete("/{designer_id}")
async def delete_designer(designer_id: str, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        designer_obj_id = ObjectId(designer_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid designer ID")
    
    result = await db.designers.delete_one({"_id": designer_obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Designer not found")
    
    return {"message": "Designer deleted successfully"}
