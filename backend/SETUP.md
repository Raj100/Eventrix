# Eventrix Backend Setup

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (if local):
```bash
mongod
```

5. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/admin/login` - Login admin
- GET `/api/auth/profile` - Get current user profile
- PUT `/api/auth/profile` - Update profile
- POST `/api/auth/logout` - Logout

### Products
- GET `/api/products` - Get all products
- GET `/api/products/{id}` - Get product details
- POST `/api/products` - Create product (admin)
- PUT `/api/products/{id}` - Update product (admin)
- DELETE `/api/products/{id}` - Delete product (admin)

### Templates
- GET `/api/templates` - Get all templates
- GET `/api/templates/{id}` - Get template details
- POST `/api/templates` - Create template (admin)
- PUT `/api/templates/{id}` - Update template (admin)
- DELETE `/api/templates/{id}` - Delete template (admin)

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user's orders
- GET `/api/orders/{id}` - Get order details
- PUT `/api/orders/{id}/status` - Update order status (admin)

### Payments
- POST `/api/payments/initiate` - Initiate payment
- POST `/api/payments/verify/{order_id}` - Verify payment

### Banners
- GET `/api/banners` - Get all banners
- POST `/api/banners` - Create banner (admin)
- PUT `/api/banners/{id}` - Update banner (admin)
- DELETE `/api/banners/{id}` - Delete banner (admin)

### Delivery
- GET `/api/delivery/charges/{pincode}` - Get delivery charge
- GET `/api/delivery/charges` - Get all delivery charges
- POST `/api/delivery/charges` - Set delivery charges (admin)

### Designers
- GET `/api/designers` - Get all designers
- POST `/api/designers` - Create designer (admin)
- PUT `/api/designers/{id}` - Update designer (admin)
- DELETE `/api/designers/{id}` - Delete designer (admin)
