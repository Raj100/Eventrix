# from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
# import os

# client: AsyncIOMotorClient | None = None
# db: AsyncIOMotorDatabase | None = None

# async def connect_db():
#     global client, db
#     client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017/eventrix"))
#     db = client["eventrix_db"]

#     # indexes
#     await db.users.create_index("email", unique=True)
#     await db.products.create_index("category")
#     await db.templates.create_index("product_id")
#     await db.orders.create_index("user_id")
#     await db.banners.create_index("is_active")

# async def close_db():
#     if client:
#         client.close()

# async def get_db() -> AsyncIOMotorDatabase:
#     return db
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


async def connect_db():
    global client, db

    mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_url)
    db = client["eventrix_db"]

    # Create indexes (safe to call multiple times)
    await db.users.create_index("email", unique=True)
    await db.products.create_index("category")
    await db.templates.create_index("product_id")
    await db.orders.create_index("user_id")
    await db.banners.create_index("is_active")


async def close_db():
    global client
    if client:
        client.close()
        client = None


async def get_db() -> AsyncIOMotorDatabase:
    if db is None:
        raise RuntimeError("Database not initialized. Did you forget to call connect_db?")
    return db
