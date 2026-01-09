# Eventrix Exhibition & Studio

A comprehensive print-on-demand e-commerce platform built with React, Next.js, FastAPI, and MongoDB.

## Features

### For Customers
- Browse and search products by category
- Customize products with templates or upload designs
- Real-time design preview
- Pincode-based delivery pricing
- Multiple payment methods (Credit Card, UPI, Google Pay)
- Order tracking and invoice management
- User account with order history
- Dark/Light theme support

### For Admins
- Complete dashboard with analytics
- Product management (add, edit, delete)
- Template management with preview
- Order management with status tracking
- Banner management for homepage (Bento Grid)
- Delivery pricing by pincode
- Designer management
- Payment configuration

### For Designers
- Custom design requests
- Direct communication with customers
- Design revision tracking
- Project portfolio management

## Tech Stack

### Frontend
- **React 19** with Server Components
- **Next.js 16** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **shadcn/ui** components
- **Recharts** for analytics

### Backend
- **FastAPI** for REST API
- **Python 3.9+**
- **Motor** for async MongoDB
- **JWT** for authentication
- **Pydantic** for data validation

### Database
- **MongoDB** for data storage
- **Indexes** for performance optimization

### DevOps
- **Vercel** for frontend deployment
- **Railway/Heroku** for backend
- **Docker** support (optional)

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB

### Frontend Setup
```bash
cd eventrix
npm install
npm run dev
# Visit http://localhost:3000
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn main:app --reload
# Visit http://localhost:8000/docs
```

## Project Structure

```
eventrix/
├── app/
│   ├── auth/              # Authentication pages
│   ├── products/          # Product catalog
│   ├── customize/         # Design customization
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── admin/            # Admin dashboard
│   └── account/          # User profile
├── components/
│   ├── layout/           # Header, footer, navigation
│   ├── sections/         # Page sections and features
│   └── ui/               # shadcn components
├── lib/
│   ├── zustand-store.ts  # State management
│   └── api-client.ts     # API integration
├── backend/
│   ├── main.py          # FastAPI application
│   ├── models.py        # Pydantic models
│   └── routers/         # API endpoints
└── README.md
```

## API Documentation

Full API documentation available at `/docs` when backend is running.

### Key Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - List products
- `POST /api/orders` - Create order
- `POST /api/payments/initiate` - Initiate payment
- `GET /api/banners` - Get banners

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions:
- GitHub Issues
- Email: support@eventrix.com
- Documentation: [Wiki](https://github.com/eventrix/wiki)
