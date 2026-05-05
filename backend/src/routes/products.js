const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const verifyToken = require('../middleware/auth');

function parseArrayValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Fall through to comma/newline parsing
    }

    return trimmed
      .split(/\n|,/) 
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseSpecsValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        label: String(item?.label || '').trim(),
        value: String(item?.value || '').trim(),
      }))
      .filter((item) => item.label && item.value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parseSpecsValue(parsed);
      }
    } catch {
      return [];
    }
  }

  return [];
}

function parseNumericValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeProduct(row) {
  const image = row.image_url || '';
  const images = Array.isArray(row.images) && row.images.length > 0 ? row.images : image ? [image] : [];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    image,
    image_url: image,
    images,
    description: row.description || '',
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews || 0),
    tags: row.tags || [],
    features: row.features || [],
    specs: row.specs || [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function normalizeProductInput(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const imageUrl = typeof body.imageUrl === 'string'
    ? body.imageUrl.trim()
    : typeof body.image === 'string'
      ? body.image.trim()
      : '';

  return {
    name,
    slug,
    category,
    description,
    imageUrl,
    images: parseArrayValue(body.images),
    tags: parseArrayValue(body.tags),
    features: parseArrayValue(body.features),
    specs: parseSpecsValue(body.specs),
    price: parseNumericValue(body.price),
    rating: parseNumericValue(body.rating),
    reviews: Math.trunc(parseNumericValue(body.reviews)),
  };
}

function validateProductInput(body) {
  const { name, slug, category } = normalizeProductInput(body);

  if (!name || !slug || !category) {
    return 'name, slug and category are required';
  }

  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows.map(normalizeProduct));
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isNumeric = /^\d+$/.test(identifier);
    const result = isNumeric
      ? await pool.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [Number(identifier)])
      : await pool.query('SELECT * FROM products WHERE slug = $1 LIMIT 1', [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(normalizeProduct(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const validationError = validateProductInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const product = normalizeProductInput(req.body);

  try {
    const existing = await pool.query('SELECT id FROM products WHERE slug = $1 LIMIT 1', [product.slug]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const result = await pool.query(
      `INSERT INTO products (
        slug, name, category, price, description, image_url, images, tags, features, specs, rating, reviews
      ) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9::jsonb,$10::jsonb,$11,$12) RETURNING *`,
      [
        product.slug,
        product.name,
        product.category,
        product.price,
        product.description,
        product.imageUrl || null,
        JSON.stringify(product.images),
        JSON.stringify(product.tags),
        JSON.stringify(product.features),
        JSON.stringify(product.specs),
        product.rating,
        product.reviews,
      ]
    );
    res.status(201).json(normalizeProduct(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const validationError = validateProductInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const productId = Number(req.params.id);
  if (Number.isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }

  const product = normalizeProductInput(req.body);

  try {
    const existing = await pool.query('SELECT id FROM products WHERE id = $1 LIMIT 1', [productId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const slugResult = await pool.query('SELECT id FROM products WHERE slug = $1 AND id <> $2 LIMIT 1', [product.slug, productId]);
    if (slugResult.rows.length > 0) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const result = await pool.query(
      `UPDATE products SET
        slug = $1,
        name = $2,
        category = $3,
        price = $4,
        description = $5,
        image_url = $6,
        images = $7::jsonb,
        tags = $8::jsonb,
        features = $9::jsonb,
        specs = $10::jsonb,
        rating = $11,
        reviews = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *`,
      [
        product.slug,
        product.name,
        product.category,
        product.price,
        product.description,
        product.imageUrl || null,
        JSON.stringify(product.images),
        JSON.stringify(product.tags),
        JSON.stringify(product.features),
        JSON.stringify(product.specs),
        product.rating,
        product.reviews,
        productId,
      ]
    );

    res.json(normalizeProduct(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const productId = Number(req.params.id);

  if (Number.isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
