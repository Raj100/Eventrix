# from fastapi import APIRouter, Depends, HTTPException, status
# from motor.motor_asyncio import AsyncIOMotorDatabase
# from bson import ObjectId
# from datetime import datetime
# from models import BannerCreate, BannerUpdate
# from core.db import get_db
# from core.security import get_admin_user

# router = APIRouter()

# @router.get("/")
# async def get_banners(db: AsyncIOMotorDatabase = Depends(get_db)):
#     now = datetime.utcnow()
#     query = {"is_active": True}
    
#     banners = []
#     async for banner in db.banners.find(query).sort("position", 1):
#         banner["id"] = str(banner["_id"])
#         banners.append(banner)
    
#     return banners

# @router.post("/")
# async def create_banner(banner: BannerCreate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     banner_data = banner.dict()
#     banner_data["created_at"] = datetime.utcnow()
#     banner_data["updated_at"] = datetime.utcnow()
    
#     result = await db.banners.insert_one(banner_data)
    
#     return {
#         "id": str(result.inserted_id),
#         **banner_data
#     }

# @router.put("/{banner_id}")
# async def update_banner(banner_id: str, banner: BannerUpdate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     try:
#         banner_obj_id = ObjectId(banner_id)
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid banner ID")
    
#     banner_data = banner.dict()
#     banner_data["updated_at"] = datetime.utcnow()
    
#     result = await db.banners.update_one(
#         {"_id": banner_obj_id},
#         {"$set": banner_data}
#     )
    
#     if result.matched_count == 0:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Banner not found")
    
#     updated_banner = await db.banners.find_one({"_id": banner_obj_id})
#     updated_banner["id"] = str(updated_banner["_id"])
#     return updated_banner

# @router.delete("/{banner_id}")
# async def delete_banner(banner_id: str, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     try:
#         banner_obj_id = ObjectId(banner_id)
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid banner ID")
    
#     result = await db.banners.delete_one({"_id": banner_obj_id})
    
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Banner not found")
    
#     return {"message": "Banner deleted successfully"}


from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

from models import BannerCreate, BannerUpdate
from core.db import get_db
from core.security import get_admin_user
from core.utils import serialize_mongo

router = APIRouter()


@router.get("/")
async def get_banners(db: AsyncIOMotorDatabase = Depends(get_db)):
    query = {"is_active": True}

    banners = [
        serialize_mongo(banner)
        async for banner in db.banners.find(query).sort("position", 1)
    ]

    return banners


@router.post("/")
async def create_banner(
    banner: BannerCreate,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    banner_data = banner.dict()
    banner_data["created_at"] = datetime.utcnow()
    banner_data["updated_at"] = datetime.utcnow()

    result = await db.banners.insert_one(banner_data)

    banner_data["_id"] = result.inserted_id
    return serialize_mongo(banner_data)


@router.put("/{banner_id}")
async def update_banner(
    banner_id: str,
    banner: BannerUpdate,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        banner_obj_id = ObjectId(banner_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid banner ID"
        )

    banner_data = banner.dict(exclude_unset=True)
    banner_data["updated_at"] = datetime.utcnow()

    result = await db.banners.update_one(
        {"_id": banner_obj_id},
        {"$set": banner_data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Banner not found"
        )

    updated_banner = await db.banners.find_one({"_id": banner_obj_id})
    return serialize_mongo(updated_banner)


@router.delete("/{banner_id}")
async def delete_banner(
    banner_id: str,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        banner_obj_id = ObjectId(banner_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid banner ID"
        )

    result = await db.banners.delete_one({"_id": banner_obj_id})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Banner not found"
        )

    return {"message": "Banner deleted successfully"}
