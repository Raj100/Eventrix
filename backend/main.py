# from fastapi import FastAPI, Depends, HTTPException, status, Security
# from starlette.middleware.cors import CORSMiddleware
# from fastapi.middleware.trustedhost import TrustedHostMiddleware
# from fastapi.security import HTTPBearer
# from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
# import os
# from contextlib import asynccontextmanager
# from datetime import datetime, timedelta
# import jwt
# import bcrypt
# from bson import ObjectId

# # Routers
# from routers import auth, products, templates, orders, payments, banners, delivery, designers, categories, users

# app = FastAPI(
#     title="Eventrix Exhibition & Studio API",
#     description="Print-on-demand e-commerce platform",
#     version="1.0.0"
# )

# # CORS Configuration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "http://localhost:8081", "https://eventrix.com"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "eventrix.com"])

# # Global database connection
# db: AsyncIOMotorDatabase = None

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Startup
#     global db
#     client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
#     db = client["eventrix_db"]
    
#     # Create indexes
#     await db.users.create_index("email", unique=True)
#     await db.products.create_index("category")
#     await db.templates.create_index("product_id")
#     await db.orders.create_index("user_id")
#     await db.banners.create_index("is_active")
    
#     yield
    
#     # Shutdown
#     client.close()

# app.router.lifespan_context = lifespan

# async def get_db():
#     return db

# # JWT Configuration
# SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
# REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY", "your-refresh-secret-key-change-in-production")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 15
# REFRESH_TOKEN_EXPIRE_DAYS = 7

# # Security scheme for Bearer token validation
# security = HTTPBearer()

# def create_access_token(data: dict, expires_delta: timedelta = None):
#     """Create JWT access token with short expiration"""
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode.update({"exp": expire, "type": "access"})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# def create_refresh_token(data: dict, expires_delta: timedelta = None):
#     """Create JWT refresh token with longer expiration"""
#     to_encode = data.copy()
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
#     to_encode.update({"exp": expire, "type": "refresh"})
#     encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# def verify_token(token: str, token_type: str = "access"):
#     """Verify JWT token and return payload"""
#     try:
#         secret_key = SECRET_KEY if token_type == "access" else REFRESH_SECRET_KEY
#         payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        
#         if payload.get("type") != token_type:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Invalid token type"
#             )
#         return payload
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Token has expired"
#         )
#     except jwt.InvalidTokenError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token"
#         )

# async def get_current_user(credentials: HTTPAuthCredentials = Security(security), db = Depends(get_db)):
#     """Extract and validate current user from Bearer token"""
#     if not credentials:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Missing authentication credentials"
#         )
    
#     token = credentials.credentials
#     payload = verify_token(token, "access")
#     user_id = payload.get("sub")
    
#     if not user_id:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token payload"
#         )
    
#     try:
#         user = await db.users.find_one({"_id": ObjectId(user_id)})
#     except:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid user ID in token"
#         )
    
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found"
#         )
    
#     return user

# async def get_admin_user(current_user = Depends(get_current_user)):
#     """Verify current user is an admin"""
#     if current_user.get("role") != "admin":
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Admin access required"
#         )
#     return current_user

# # Include routers
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
# app.include_router(products.router, prefix="/api/products", tags=["Products"])
# app.include_router(templates.router, prefix="/api/templates", tags=["Templates"])
# app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
# app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
# app.include_router(banners.router, prefix="/api/banners", tags=["Banners"])
# app.include_router(delivery.router, prefix="/api/delivery", tags=["Delivery"])
# app.include_router(designers.router, prefix="/api/designers", tags=["Designers"])
# app.include_router(users.router, prefix="/api/users", tags=["Users"])

# @app.get("/api/health")
# async def health_check():
#     return {"status": "ok", "timestamp": datetime.utcnow()}

# @app.get("/")
# async def root():
#     return {"message": "Eventrix Exhibition & Studio API"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)



from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager

from core.db import connect_db, close_db

from routers import (
    auth,
    products,
    templates,
    orders,
    payments,
    banners,
    delivery,
    designers,
    categories,
    users,
)

app = FastAPI(
    title="Eventrix Exhibition & Studio API",
    description="Print-on-demand e-commerce platform",
    version="1.0.0",
)


# ------------------- LIFESPAN -------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app.router.lifespan_context = lifespan


# ------------------- MIDDLEWARE -------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8081",
        "https://eventrix.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "eventrix.com"],
)


# ------------------- ROUTERS -------------------

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(templates.router, prefix="/api/templates", tags=["Templates"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(banners.router, prefix="/api/banners", tags=["Banners"])
app.include_router(delivery.router, prefix="/api/delivery", tags=["Delivery"])
app.include_router(designers.router, prefix="/api/designers", tags=["Designers"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])


# ------------------- HEALTH -------------------

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.get("/")
async def root():
    return {"message": "Eventrix Exhibition & Studio API"}
