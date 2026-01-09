# from fastapi import APIRouter, Depends, HTTPException, status
# from motor.motor_asyncio import AsyncIOMotorDatabase
# from bson import ObjectId
# from datetime import datetime
# from models import CategoryCreate, CategoryUpdate
# from core.db import get_db
# from core.security import get_admin_user

# router = APIRouter()

# @router.get("/")
# async def get_categories(db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Get all active categories with their product counts"""
#     categories = []
#     async for category in db.categories.find({"is_active": True}).sort("order", 1):
#         category["id"] = str(category["_id"])
#         # Get product count for this category
#         product_count = await db.products.count_documents({"category_id": str(category["_id"]), "is_active": True})
#         category["product_count"] = product_count
#         categories.append(category)
#     return categories

# @router.get("/{category_id}")
# async def get_category(category_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Get a specific category with all its products"""
#     try:
#         category = await db.categories.find_one({"_id": ObjectId(category_id)})
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID")
    
#     if not category:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
#     category["id"] = str(category["_id"])
    
#     # Get products in this category
#     products = []
#     async for product in db.products.find({"category_id": category_id, "is_active": True}):
#         product["id"] = str(product["_id"])
#         products.append(product)
    
#     category["products"] = products
#     return category

# @router.post("/")
# async def create_category(category: CategoryCreate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Admin only: Create a new category"""
#     category_data = category.dict()
#     category_data["created_at"] = datetime.utcnow()
#     category_data["updated_at"] = datetime.utcnow()
    
#     result = await db.categories.insert_one(category_data)
#     return {
#         "id": str(result.inserted_id),
#         **category_data
#     }

# @router.put("/{category_id}")
# async def update_category(category_id: str, category: CategoryUpdate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Admin only: Update a category"""
#     try:
#         category_obj_id = ObjectId(category_id)
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID")
    
#     category_data = category.dict()
#     category_data["updated_at"] = datetime.utcnow()
    
#     result = await db.categories.update_one(
#         {"_id": category_obj_id},
#         {"$set": category_data}
#     )
    
#     if result.matched_count == 0:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
#     updated = await db.categories.find_one({"_id": category_obj_id})
#     updated["id"] = str(updated["_id"])
#     return updated

# @router.delete("/{category_id}")
# async def delete_category(category_id: str, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Admin only: Delete a category"""
#     try:
#         category_obj_id = ObjectId(category_id)
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID")
    
#     result = await db.categories.delete_one({"_id": category_obj_id})
    
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
#     return {"message": "Category deleted successfully"}















# @router.get("/")
# async def get_categories(db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Get all active categories with their product counts"""
#     categories = []
#     async for category in db.categories.find({"is_active": True}).sort("order", 1):
#         category["id"] = str(category["_id"])
#         # Get product count for this category
#         product_count = await db.products.count_documents({"category_id": str(category["_id"]), "is_active": True})
#         category["product_count"] = product_count
#         categories.append(category)
#     return categories

# @router.get("/{category_id}")
# async def get_category(category_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Get a specific category with all its products"""
#     try:
#         category = await db.categories.find_one({"_id": ObjectId(category_id), "is_active": True})
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID")
    
#     if not category:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
#     category["id"] = str(category["_id"])
    
#     # Get products in this category
#     products = []
#     async for product in db.products.find({"category_id": category_id, "is_active": True}):
#         product["id"] = str(product["_id"])
#         products.append(product)
    
#     category["products"] = products
#     return category

# @router.post("/")
# async def create_category(category: CategoryCreate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Admin only: Create a new category
    
#     Checks if category with same name already exists (case-insensitive)
#     """
#     existing = await db.categories.find_one({
#         "name": {"$regex": f"^{category.name}$", "$options": "i"},
#         "is_active": True
#     })
    
#     if existing:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=f"Category '{category.name}' already exists"
#         )
    
#     category_data = category.dict()
#     category_data["is_active"] = True
#     category_data["created_at"] = datetime.utcnow()
#     category_data["updated_at"] = datetime.utcnow()
    
#     result = await db.categories.insert_one(category_data)
#     created_category = await db.categories.find_one({"_id": result.inserted_id})
#     created_category["id"] = str(created_category["_id"])
    
#     return created_category

# @router.put("/{category_id}")
# async def update_category(category_id: str, category: CategoryUpdate, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Admin only: Update a category"""
#     try:
#         category_obj_id = ObjectId(category_id)
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID")
    
#     category_data = category.dict()
#     category_data["updated_at"] = datetime.utcnow()
    
#     result = await db.categories.update_one(
#         {"_id": category_obj_id},
#         {"$set": category_data}
#     )
    
#     if result.matched_count == 0:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
#     updated = await db.categories.find_one({"_id": category_obj_id})
#     updated["id"] = str(updated["_id"])
#     return updated

# @router.delete("/{category_id}")
# async def delete_category(category_id: str, current_user: dict = Depends(get_admin_user), db: AsyncIOMotorDatabase = Depends(get_db)):
#     """Admin only: Delete a category (soft delete - sets is_active to False)"""
#     try:
#         category_obj_id = ObjectId(category_id)
#     except:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID")
    
#     result = await db.categories.update_one(
#         {"_id": category_obj_id},
#         {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
#     )
    
#     if result.matched_count == 0:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
#     return {"message": "Category deleted successfully"}





from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

from models import CategoryCreate, CategoryUpdate
from core.db import get_db
from core.security import get_admin_user
from core.utils import serialize_mongo, serialize_mongo_list

router = APIRouter()


@router.get("/")
async def get_categories(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all active categories with their product counts"""
    categories = []

    async for category in db.categories.find({"is_active": True}).sort("order", 1):
        # product count
        product_count = await db.products.count_documents(
            {"category_id": str(category["_id"]), "is_active": True}
        )
        category["product_count"] = product_count
        categories.append(serialize_mongo(category))

    return categories


@router.get("/{category_id}")
async def get_category(category_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a specific category with all its products"""
    try:
        category = await db.categories.find_one(
            {"_id": ObjectId(category_id), "is_active": True}
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID"
        )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )

    # get products
    products = []
    async for product in db.products.find({"category_id": category_id, "is_active": True}):
        products.append(serialize_mongo(product))

    category["products"] = products

    return serialize_mongo(category)


@router.post("/")
async def create_category(
    category: CategoryCreate,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Admin only: Create a new category (case-insensitive unique)"""

    existing = await db.categories.find_one(
        {
            "name": {"$regex": f"^{category.name}$", "$options": "i"},
            "is_active": True,
        }
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category '{category.name}' already exists",
        )

    category_data = category.dict()
    category_data["is_active"] = True
    category_data["created_at"] = datetime.utcnow()
    category_data["updated_at"] = datetime.utcnow()

    result = await db.categories.insert_one(category_data)
    created = await db.categories.find_one({"_id": result.inserted_id})

    return serialize_mongo(created)


@router.put("/{category_id}")
async def update_category(
    category_id: str,
    category: CategoryUpdate,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Admin only: Update a category"""

    try:
        category_obj_id = ObjectId(category_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID"
        )

    category_data = category.dict(exclude_unset=True)
    category_data["updated_at"] = datetime.utcnow()

    result = await db.categories.update_one(
        {"_id": category_obj_id}, {"$set": category_data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )

    updated = await db.categories.find_one({"_id": category_obj_id})
    return serialize_mongo(updated)


@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Admin only: Soft delete category"""

    try:
        category_obj_id = ObjectId(category_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID"
        )

    result = await db.categories.update_one(
        {"_id": category_obj_id},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow()}},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )

    return {"message": "Category deleted successfully"}
