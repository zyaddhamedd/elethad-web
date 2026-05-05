# Backend Quick Reference & Setup Guide

## API ENDPOINTS SUMMARY

```
Authentication
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/refresh-token
  POST   /api/auth/logout
  GET    /api/auth/me (Protected)

Products
  GET    /api/products
  GET    /api/products/:id
  POST   /api/products (Admin)
  PATCH  /api/products/:id (Admin)
  DELETE /api/products/:id (Admin)
  GET    /api/products/:id/reviews

Categories
  GET    /api/categories
  POST   /api/categories (Admin)
  PATCH  /api/categories/:id (Admin)
  DELETE /api/categories/:id (Admin)

Orders
  POST   /api/orders
  GET    /api/orders/:order_id
  GET    /api/orders (My Orders - Protected)
  PATCH  /api/orders/:order_id (Admin)
  DELETE /api/orders/:order_id (Admin)

Messages
  POST   /api/messages
  GET    /api/messages (Admin)
  PATCH  /api/messages/:id (Admin)

Reviews
  POST   /api/products/:id/reviews
  GET    /api/reviews/:id (Admin)
  PATCH  /api/reviews/:id (Admin)

Admin Dashboard
  GET    /api/admin/dashboard
  GET    /api/admin/analytics
  GET    /api/admin/orders
  GET    /api/admin/messages
  GET    /api/admin/products
  GET    /api/admin/customers
  GET    /api/admin/users
  POST   /api/admin/users (Admin)
```

---

## QUICK SETUP INSTRUCTIONS

### 1. Backend Framework Choice

#### Option A: Node.js + Express (Recommended)
```bash
mkdir elethad-backend
cd elethad-backend
npm init -y
npm install express cors dotenv pg bcryptjs jsonwebtoken
npm install --save-dev nodemon typescript ts-node

# Create directory structure
mkdir -p src/{routes,controllers,models,middleware,utils,config}
```

#### Option B: Python + FastAPI
```bash
mkdir elethad-backend
cd elethad-backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn psycopg2-binary sqlalchemy python-dotenv python-jose bcrypt
```

### 2. Database Setup

```bash
# PostgreSQL Installation
brew install postgresql@15  # macOS
# or download from postgresql.org

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb elethad_db
createuser elethad_user
psql -d elethad_db -c "ALTER USER elethad_user WITH PASSWORD 'strong_password';"

# Create schema
psql -d elethad_db -U elethad_user -f schema.sql
```

**PostgreSQL Connection String:**
```
postgresql://elethad_user:strong_password@localhost:5432/elethad_db
```

### 3. Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://elethad_user:password@localhost:5432/elethad_db

# Server
PORT=3001
NODE_ENV=development

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=7d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# File Upload
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=elethad-uploads
AWS_REGION=us-east-1

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000
```

### 4. Database Schema Creation

Save this as `schema.sql`:

```sql
-- Run this file to set up your database
-- psql -d elethad_db -U elethad_user -f schema.sql

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- Run all table creation queries from BACKEND_ANALYSIS.md

-- Create indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active_featured ON products(is_active, is_featured DESC);
CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_messages_status_created ON messages(status, created_at DESC);
CREATE INDEX idx_reviews_product_status ON reviews(product_id, status);

-- Create full-text search index
CREATE INDEX idx_products_search ON products 
  USING GIN (to_tsvector('arabic', name_ar || ' ' || description_ar));

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables with updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... repeat for other tables
```

### 5. Basic Express.js Setup

**src/config/database.ts**
```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```

**src/middleware/auth.ts**
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = (decoded as any).userId;
    req.userRole = (decoded as any).role;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userRole !== 'admin' && req.userRole !== 'manager') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};
```

**src/index.ts**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 6. Sample Controller (Products)

**src/controllers/productController.ts**
```typescript
import { Request, Response } from 'express';
import pool from '../config/database';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, sort = 'newest', limit = 20, offset = 0 } = req.query;

    let query = `SELECT p.*, c.name_ar as category_name FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.id 
                 WHERE p.is_active = true`;
    const params: any[] = [];

    if (category) {
      query += ` AND c.slug = $${params.length + 1}`;
      params.push(category);
    }

    if (search) {
      query += ` AND (p.name_ar ILIKE $${params.length + 1} OR p.description_ar ILIKE $${params.length + 2})`;
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    // Sorting
    const sortOptions: Record<string, string> = {
      'newest': 'p.created_at DESC',
      'price-asc': 'p.price ASC',
      'price-desc': 'p.price DESC',
      'rating': 'p.average_rating DESC',
    };
    query += ` ORDER BY ${sortOptions[sort as string] || 'p.created_at DESC'}`;

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit);
    params.push(offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products WHERE is_active = true`
    );

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `SELECT p.*, c.name_ar as category_name FROM products p 
                   LEFT JOIN categories c ON p.category_id = c.id 
                   WHERE p.id = $1 OR p.slug = $1`;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Get related images
    const imagesResult = await pool.query(
      `SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order`,
      [result.rows[0].id]
    );

    // Get details/specs
    const detailsResult = await pool.query(
      `SELECT * FROM product_details WHERE product_id = $1 ORDER BY display_order`,
      [result.rows[0].id]
    );

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        images: imagesResult.rows,
        details: detailsResult.rows,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};
```

### 7. Frontend Integration

**Replace hardcoded data in Next.js:**

```typescript
// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const fetchProducts = async (category?: string) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  
  const res = await fetch(`${API_URL}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id: string) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export const submitOrder = async (orderData: any) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
};

export const submitMessage = async (messageData: any) => {
  const res = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData),
  });
  if (!res.ok) throw new Error('Failed to submit message');
  return res.json();
};
```

**Update .env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Update component to use API:**
```typescript
// src/lib/products.ts - Add to existing code
import { fetchProducts } from './api';

export async function getProductsFromAPI(category?: string) {
  try {
    const response = await fetchProducts(category);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch from API, falling back to local data');
    // Fallback to hardcoded data
    return products.filter(p => !category || p.category === category);
  }
}
```

---

## DEPLOYMENT CHECKLIST

### Local Development
- [ ] PostgreSQL installed & running
- [ ] Environment variables configured
- [ ] Backend server running (`npm run dev`)
- [ ] Frontend connecting to backend
- [ ] All CRUD operations tested

### Before Production
- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure email service
- [ ] Test payment gateway integration
- [ ] Set up monitoring & alerts
- [ ] Create database indexes
- [ ] Test database queries for N+1 problems

### Hosting Options

**Backend Hosting:**
- Heroku (easy but pricey)
- Railway.app (affordable, good for startups)
- DigitalOcean (reliable, good value)
- AWS EC2 (powerful but complex)
- Render (good for Node.js)

**Database Hosting:**
- AWS RDS PostgreSQL
- Railway PostgreSQL
- DigitalOcean Managed Databases
- PlanetScale (if using MySQL)

**File Storage:**
- AWS S3
- DigitalOcean Spaces
- Firebase Storage

---

## TESTING RECOMMENDATIONS

### Unit Tests
```bash
npm install --save-dev jest @types/jest ts-jest
```

### Integration Tests
- Test all API endpoints with real database
- Test authentication flows
- Test order creation & payment

### Performance Testing
- Load testing with k6 or Artillery
- Database query optimization
- Caching strategies

---

## GIT SETUP

```bash
cd elethad-backend
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/yourusername/elethad-backend.git
git push -u origin main
```

**.gitignore**
```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
*.log
.DS_Store
__pycache__/
venv/
```

---

## NEXT STEPS

1. **Choose technology stack** (Node.js or Python)
2. **Set up database** using provided schema
3. **Create API structure** with authentication
4. **Build Products & Categories endpoints** first
5. **Implement Orders API** with payment integration
6. **Create Admin Dashboard** endpoints
7. **Test all endpoints** thoroughly
8. **Connect Frontend** to new API
9. **Deploy** to production environment

**Estimated time to MVP:** 2-3 weeks  
**Estimated time to production-ready:** 4-6 weeks

