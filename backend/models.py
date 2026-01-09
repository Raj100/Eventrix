from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Auth Models
class UserRole(str, Enum):
    user = "user"
    admin = "admin"
    designer = "designer"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    email_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    phone: str
    role: UserRole
    created_at: datetime

# Category Model - NEW
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    image_url: Optional[str] = None
    order: int = 0
    is_active: bool = True

class CategoryUpdate(CategoryCreate):
    pass

class CategoryResponse(CategoryCreate):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

# Product Models
class ProductColor(BaseModel):
    name: str
    code: str

class ProductSize(BaseModel):
    name: str
    price_multiplier: float = 1.0

class ProductCreate(BaseModel):
    name: str
    description: str
    category_id: str  # CHANGED: reference category by ID
    base_price: float
    colors: List[ProductColor]
    sizes: List[ProductSize]
    images: List[str]
    is_active: bool = True

class ProductUpdate(ProductCreate):
    pass

class ProductResponse(ProductCreate):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

# Template Models
class TemplateCreate(BaseModel):
    name: str
    product_id: str
    description: str
    preview_image: str
    design_data: dict  # Stores text, colors, positions, etc.
    price_adjustment: float = 0
    is_active: bool = True

class TemplateUpdate(TemplateCreate):
    pass

class TemplateResponse(TemplateCreate):
    id: str = Field(alias="_id")
    created_at: datetime

# Design Request Models
class DesignRequest(BaseModel):
    title: str
    description: str
    budget: float
    deadline: Optional[datetime] = None
    reference_images: List[str] = []

class DesignRequestCreate(DesignRequest):
    product_id: str
    user_id: str

class DesignRequestResponse(DesignRequestCreate):
    id: str = Field(alias="_id")
    status: str = "pending"  # pending, assigned, in_progress, completed, rejected
    assigned_designer: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# Order Models
class OrderItem(BaseModel):
    product_id: str
    quantity: int
    color: str
    size: str
    price: float
    design_template_id: Optional[str] = None
    custom_design: Optional[dict] = None

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shipping_address: dict
    pincode: str
    payment_method: str  # card, upi, gpay

class OrderResponse(OrderCreate):
    id: str = Field(alias="_id")
    user_id: str
    status: str = "pending"  # pending, confirmed, processing, shipped, delivered, cancelled
    subtotal: float
    tax: float
    delivery_charge: float
    total: float
    created_at: datetime
    updated_at: datetime

# Payment Models
class PaymentInitiate(BaseModel):
    order_id: str
    amount: float
    payment_method: str

class PaymentVerify(BaseModel):
    transaction_id: str
    status: str  # success, failed, pending

# Banner Models
class BannerCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    link: Optional[str] = None
    position: int = 0
    is_active: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class BannerUpdate(BannerCreate):
    pass

class BannerResponse(BannerCreate):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

# Delivery Models
class DeliveryCharges(BaseModel):
    pincode: str
    charge: float
    delivery_days: int = 3

class DeliveryChargesUpdate(BaseModel):
    charges: List[DeliveryCharges]

# Designer Models
class DesignerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    portfolio_url: Optional[str] = None
    specialization: List[str]

class DesignerUpdate(DesignerCreate):
    pass

class DesignerResponse(DesignerCreate):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime
