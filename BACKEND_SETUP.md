# Eventrix Exhibition & Studio - Backend Setup Guide

## Overview
Complete FastAPI backend for print-on-demand e-commerce platform with MongoDB database.

## Tech Stack
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment**: Stripe, UPI, GPay integration
- **Email**: SMTP with templates
- **File Storage**: AWS S3 / Azure Blob

## Project Structure

```
eventrix-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry
│   ├── config.py              # Configuration settings
│   ├── dependencies.py        # Dependency injection
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py       # Authentication endpoints
│   │   │   ├── products.py   # Product management
│   │   │   ├── templates.py  # Design templates
│   │   │   ├── designs.py    # Custom designs
│   │   │   ├── orders.py     # Order management
│   │   │   ├── payments.py   # Payment processing
│   │   │   ├── users.py      # User profiles
│   │   │   └── admin.py      # Admin endpoints
│   │   └── routes.py          # API routing
│   ├── models/
│   │   ├── user.py           # User schema
│   │   ├── product.py        # Product schema
│   │   ├── template.py       # Template schema
│   │   ├── design.py         # Design schema
│   │   ├── order.py          # Order schema
│   │   └── payment.py        # Payment schema
│   ├── schemas/
│   │   ├── user.py           # User request/response
│   │   ├── product.py        # Product request/response
│   │   └── order.py          # Order request/response
│   ├── services/
│   │   ├── auth_service.py    # Auth logic
│   │   ├── product_service.py # Product logic
│   │   ├── order_service.py   # Order logic
│   │   ├── payment_service.py # Payment logic
│   │   ├── email_service.py   # Email service
│   │   └── design_service.py  # Design logic
│   ├── database/
│   │   ├── connection.py      # MongoDB connection
│   │   └── init.py           # DB initialization
│   └── utils/
│       ├── jwt.py            # JWT utilities
│       ├── validators.py     # Input validation
│       └── constants.py      # App constants
├── tests/
│   ├── __init__.py
│   └── test_api.py
├── requirements.txt
├── .env.example
└── README.md
```

## Installation & Setup

### 1. Prerequisites
```bash
python 3.10+
MongoDB 5.0+
pip/poetry
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Variables (.env)
```
# Database
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/eventrix
MONGODB_DB_NAME=eventrix

# API
API_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@eventrix.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# UPI/Payment
UPI_MERCHANT_ID=your-merchant-id
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET_NAME=eventrix-uploads
AWS_S3_REGION=us-east-1

# Admin
ADMIN_EMAIL=admin@eventrix.com
ADMIN_PASSWORD=secure-password
```

### 5. Initialize Database
```bash
python -m app.database.init
```

### 6. Run Development Server
```bash
uvicorn app.main:app --reload
```

Server runs on `http://localhost:8000`
API docs: `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/password-reset` - Reset password

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/products/category/{category}` - Get by category
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/{id}` - Update product (Admin)
- `DELETE /api/v1/products/{id}` - Delete product (Admin)

### Templates
- `GET /api/v1/templates` - List templates
- `GET /api/v1/templates/{id}` - Get template
- `POST /api/v1/templates` - Create template
- `GET /api/v1/templates/product/{product_id}` - Get by product

### Custom Designs
- `POST /api/v1/designs/upload` - Upload design file
- `POST /api/v1/designs/request` - Request custom design
- `GET /api/v1/designs/requests` - Get design requests
- `PUT /api/v1/designs/requests/{id}` - Update request status

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/{id}` - Get order details
- `PUT /api/v1/orders/{id}` - Update order status (Admin)
- `GET /api/v1/orders/{id}/invoice` - Get invoice

### Payments
- `POST /api/v1/payments/stripe` - Stripe payment
- `POST /api/v1/payments/upi` - UPI payment
- `POST /api/v1/payments/gpay` - Google Pay
- `GET /api/v1/payments/{id}` - Get payment status
- `POST /api/v1/payments/{id}/verify` - Verify payment

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `GET /api/v1/users/orders` - Get user orders
- `GET /api/v1/users/invoices` - Get invoices
- `DELETE /api/v1/users/account` - Delete account

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/orders` - All orders
- `GET /api/v1/admin/banners` - Manage banners
- `POST /api/v1/admin/banners` - Create banner
- `DELETE /api/v1/admin/banners/{id}` - Delete banner
- `GET /api/v1/admin/designers` - List designers
- `POST /api/v1/admin/designers/{id}/assign` - Assign order

## Database Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  fullName: String,
  phone: String,
  avatar: String (URL),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: String (user, designer, admin),
  isActive: Boolean,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String (mug, t-shirt, business-card, poster, etc),
  basePrice: Number,
  sizes: [{size: String, priceMultiplier: Number}],
  colors: [String],
  images: [String] (URLs),
  templates: [ObjectId], // Reference to templates
  printArea: {width: Number, height: Number},
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Template
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  productId: ObjectId,
  preview: String (URL),
  design: {
    json: Object, // Design JSON (Figma/Canvas format)
    svg: String
  },
  price: Number, // Template cost
  isPremium: Boolean,
  createdBy: ObjectId,
  usageCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  orderId: String (unique),
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    designId: ObjectId,
    templateId: ObjectId,
    price: Number,
    customizations: Object
  }],
  totalPrice: Number,
  shippingAddress: {
    name: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentStatus: String (pending, completed, failed),
  orderStatus: String (pending, processing, shipped, delivered, cancelled),
  paymentId: ObjectId,
  estimatedDelivery: Date,
  trackingNumber: String,
  invoiceUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  userId: ObjectId,
  amount: Number,
  currency: String,
  method: String (stripe, upi, gpay),
  transactionId: String,
  status: String (pending, completed, failed, refunded),
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Features Implementation

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (user, designer, admin)
- Email verification
- Password reset with token
- Session management

### 2. Product Management
- Full CRUD operations
- Category filtering
- Search functionality
- Product variants (size, color, price)
- Trending products tracking

### 3. Templates System
- Pre-designed templates
- Template categories
- Preview generation
- Usage tracking
- Premium templates

### 4. Design System
- File upload (images, PDFs)
- Design preview
- Custom design requests
- Designer assignment
- Progress tracking

### 5. Order Management
- Shopping cart
- Order creation
- Order tracking
- Status updates
- Invoice generation

### 6. Payment Integration
- Stripe integration
- UPI payment gateway
- Google Pay
- Payment verification
- Refund processing

### 7. Email Notifications
- Order confirmation
- Design ready notification
- Shipping updates
- Invoice delivery
- Password reset

### 8. Admin Dashboard
- Dashboard statistics
- Order management
- Product management
- Banner management
- Designer assignment
- User management

## Testing

### Run Tests
```bash
pytest
```

### Test Coverage
```bash
pytest --cov=app
```

## Deployment

### Docker
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build & Run
```bash
docker build -t eventrix-backend .
docker run -p 8000:8000 eventrix-backend
```

### Docker Compose
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URL: mongodb://admin:password@mongodb:27017
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **Password Hashing**: Use bcrypt for password storage
3. **JWT Tokens**: Set appropriate expiration times
4. **CORS**: Configure CORS properly
5. **Input Validation**: Validate all inputs
6. **SQL Injection**: Use parameterized queries
7. **HTTPS**: Always use HTTPS in production
8. **Rate Limiting**: Implement rate limiting
9. **Logging**: Log all important events
10. **Monitoring**: Monitor API performance

## Error Handling

All endpoints return JSON responses:
```json
{
  "status": "success" | "error",
  "data": {},
  "message": "Descriptive message",
  "errors": [{}]
}
```

## Rate Limiting

- Default: 100 requests per minute per IP
- Auth endpoints: 10 requests per minute
- Payment endpoints: 5 requests per minute

## Support & Documentation

- API Documentation: `/docs` (Swagger UI)
- ReDoc: `/redoc`
- OpenAPI Schema: `/openapi.json`
