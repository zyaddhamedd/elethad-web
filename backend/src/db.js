require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client:', err);
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  province TEXT,
  service TEXT,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  governorate TEXT NOT NULL,
  payment_method VARCHAR(20) NOT NULL DEFAULT 'cash',
  payment_screenshot_url TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
`;

const alterCategoriesQuery = `
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
`;

const alterProductsQuery = `
ALTER TABLE products
ADD COLUMN IF NOT EXISTS slug VARCHAR,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
`;

const removeMockCategoriesQuery = `
DELETE FROM categories
WHERE slug IN (
  'boost-pumps',
  'holmen-submersible',
  'cast-iron-stainless-submersible',
  'holmen-deep-well',
  'full-cast-iron-submersible',
  'full-stainless-submersible'
);
`;

const removeMockProductsQuery = `
DELETE FROM products
WHERE slug IN (
  'proflow-x-1000',
  'holmen-sub-750',
  'cast-iron-titan',
  'holmen-deep-well-2hp'
);
`;

async function initDB() {
  try {
    await pool.query('SELECT 1');
    await pool.query(createTableQuery);
    await pool.query(alterProductsQuery);
    await pool.query(alterCategoriesQuery);
    await pool.query(removeMockCategoriesQuery);
    await pool.query(removeMockProductsQuery);

    // Seed default admin safely without unnecessary hashing
    const adminCheck = await pool.query('SELECT id FROM admin_users WHERE username = $1', ['test']);
    if (adminCheck.rowCount === 0) {
      const hash = await bcrypt.hash('1234', 10);
      await pool.query(
        `INSERT INTO admin_users (username, password_hash, role) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (username) DO NOTHING`,
        ['test', hash, 'admin']
      );
      console.log('✅ Admin seeded successfully');
    } else {
      console.log('✅ Admin already exists');
    }

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  }
}

module.exports = { pool, initDB };
