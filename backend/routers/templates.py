from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from models import TemplateCreate, TemplateUpdate
from core.db import get_db
from core.security import get_admin_user

router = APIRouter()

@router.get("/")
async def get_templates(product_id: str = Query(None), db: AsyncIOMotorDatabase = Depends(get_db)):
    query = {"is_active": True}
    if product_id:
        query["product_id"] = product_id
    
    templates = []
    async for template in db.templates.find(query):
        template["id"] = str(template["_id"])
        templates.append(template)
    
    return templates

@router.get("/{template_id}")
async def get_template(template_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        template = await db.templates.find_one({"_id": ObjectId(template_id)})
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid template ID")
    
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    
    template["id"] = str(template["_id"])
    return template

@router.post("/")
async def create_template(template: TemplateCreate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    template_data = template.dict()
    template_data["created_at"] = datetime.utcnow()
    template_data["updated_at"] = datetime.utcnow()
    
    result = await db.templates.insert_one(template_data)
    
    return {
        "id": str(result.inserted_id),
        **template_data
    }

@router.put("/{template_id}")
async def update_template(template_id: str, template: TemplateUpdate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        template_obj_id = ObjectId(template_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid template ID")
    
    template_data = template.dict()
    template_data["updated_at"] = datetime.utcnow()
    
    result = await db.templates.update_one(
        {"_id": template_obj_id},
        {"$set": template_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    
    updated_template = await db.templates.find_one({"_id": template_obj_id})
    updated_template["id"] = str(updated_template["_id"])
    return updated_template

@router.delete("/{template_id}")
async def delete_template(template_id: str, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        template_obj_id = ObjectId(template_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid template ID")
    
    result = await db.templates.delete_one({"_id": template_obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    
    return {"message": "Template deleted successfully"}
