from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

from models import ProductCreate, ProductUpdate
from core.db import get_db
from core.security import get_admin_user
from core.utils import serialize_mongo, serialize_mongo_list

router = APIRouter()


@router.get("/")
async def get_products(
    category_id: str = Query(None),
    search: str = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Get all active products with optional filtering by category and search"""

    query = {"is_active": True}

    if category_id:
        query["category_id"] = category_id

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    products = []
    async for product in db.products.find(query):
        products.append(serialize_mongo(product))

    return products


@router.get("/{product_id}")
async def get_product(product_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a specific product by ID"""

    try:
        product = await db.products.find_one({"_id": ObjectId(product_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product ID"
        )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    return serialize_mongo(product)


@router.post("/")
async def create_product(
    product: ProductCreate,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Admin only: Create a new product"""

    # Validate category exists
    try:
        category_obj_id = ObjectId(product.category_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID"
        )

    category = await db.categories.find_one({"_id": category_obj_id})
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found"
        )

    product_data = product.dict()
    product_data["is_active"] = True
    product_data["created_at"] = datetime.utcnow()
    product_data["updated_at"] = datetime.utcnow()

    result = await db.products.insert_one(product_data)
    created = await db.products.find_one({"_id": result.inserted_id})

    return serialize_mongo(created)


@router.put("/{product_id}")
async def update_product(
    product_id: str,
    product: ProductUpdate,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Admin only: Update a product"""

    try:
        product_obj_id = ObjectId(product_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product ID"
        )

    # Validate category exists (if provided)
    if product.category_id:
        try:
            category_obj_id = ObjectId(product.category_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category ID"
            )

        category = await db.categories.find_one({"_id": category_obj_id})
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found"
            )

    product_data = product.dict(exclude_unset=True)
    product_data["updated_at"] = datetime.utcnow()

    result = await db.products.update_one(
        {"_id": product_obj_id}, {"$set": product_data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    updated_product = await db.products.find_one({"_id": product_obj_id})
    return serialize_mongo(updated_product)


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Admin only: Soft delete product"""

    try:
        product_obj_id = ObjectId(product_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product ID"
        )

    result = await db.products.update_one(
        {"_id": product_obj_id},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow()}},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

    return {"message": "Product deleted successfully"}
