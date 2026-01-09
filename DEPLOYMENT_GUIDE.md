# Eventrix Exhibition & Studio - Deployment Guide

## Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account (or local MongoDB)
- Vercel account (for frontend)
- Railway/Heroku account (for backend, optional)

## Frontend Deployment (Next.js on Vercel)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/new
   - Import your repository
   - Set environment variables in Settings > Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
     ```

3. **Configure Custom Domain** (optional)
   - Go to Settings > Domains
   - Add your custom domain

## Backend Deployment (FastAPI)

### Option 1: Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Deploy**
   ```bash
   railway init
   railway up
   ```

3. **Set Environment Variables**
   ```bash
   railway variable set MONGODB_URL=your_mongodb_uri
   railway variable set SECRET_KEY=your_secret_key
   ```

### Option 2: Heroku

1. **Create Procfile**
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Deploy**
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set MONGODB_URL=your_mongodb_uri
   heroku config:set SECRET_KEY=your_secret_key
   git push heroku main
   ```

## Database Setup (MongoDB)

1. **Create MongoDB Atlas Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Create a database user
   - Whitelist your IP
   - Copy connection string

2. **Initialize Database**
   - Run the backend server
   - API endpoints will automatically create necessary indexes

## Environment Variables Checklist

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend (.env)
- `MONGODB_URL` - MongoDB connection string
- `SECRET_KEY` - JWT secret (generate with: `openssl rand -hex 32`)
- `SMTP_SERVER` - Email server (e.g., smtp.gmail.com)
- `SMTP_USERNAME` - Email username
- `SMTP_PASSWORD` - Email password

## Post-Deployment

1. **Create Admin Account**
   - Sign up via `/auth/register`
   - Update user role to "admin" in MongoDB:
     ```javascript
     db.users.updateOne(
       { email: "admin@eventrix.com" },
       { $set: { role: "admin" } }
     )
     ```

2. **Add Initial Data**
   - Access admin dashboard at `/admin`
   - Add products, templates, and banners

3. **Configure Payment Gateway** (optional)
   - Add Stripe/Razorpay keys in admin settings

## Monitoring

- Frontend: Vercel Analytics
- Backend: Railway/Heroku logs
- Database: MongoDB Atlas monitoring

## Troubleshooting

**CORS Issues**
- Update CORS_ORIGINS in main.py
- Ensure frontend URL is whitelisted

**Database Connection Failed**
- Check MongoDB IP whitelist
- Verify connection string
- Check firewall settings

**Payment Integration Issues**
- Verify API keys are correct
- Check webhook URLs are accessible

## Support

For issues, refer to:
- API Documentation: `backend/SETUP.md`
- Frontend docs: https://nextjs.org/docs
- MongoDB docs: https://docs.mongodb.com/
