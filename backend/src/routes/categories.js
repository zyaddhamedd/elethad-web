const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const verifyToken = require('../middleware/auth');

function normalizeCategoryInput(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : null;
  const description = typeof body.description === 'string' ? body.description.trim() : null;

  return { name, slug, imageUrl, description };
}

function validateCategoryInput(body) {
  const { name, slug } = normalizeCategoryInput(body);

  if (!name || !slug) {
    return 'name and slug are required';
  }

  return null;
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY created_at DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1 LIMIT 1', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const validationError = validateCategoryInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, slug, imageUrl, description } = normalizeCategoryInput(req.body);

  try {
    const existing = await pool.query('SELECT id FROM categories WHERE slug = $1 LIMIT 1', [slug]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, slug, image_url, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, slug, imageUrl || null, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const validationError = validateCategoryInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { name, slug, imageUrl, description } = normalizeCategoryInput(req.body);
  const categoryId = Number(req.params.id);

  if (Number.isNaN(categoryId)) {
    return res.status(400).json({ error: 'Invalid category id' });
  }

  try {
    const categoryResult = await pool.query('SELECT id FROM categories WHERE id = $1 LIMIT 1', [categoryId]);
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const slugResult = await pool.query('SELECT id FROM categories WHERE slug = $1 AND id <> $2 LIMIT 1', [slug, categoryId]);
    if (slugResult.rows.length > 0) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const result = await pool.query(
      'UPDATE categories SET name = $1, slug = $2, image_url = $3, description = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, slug, imageUrl || null, description || null, categoryId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const categoryId = Number(req.params.id);

  if (Number.isNaN(categoryId)) {
    return res.status(400).json({ error: 'Invalid category id' });
  }

  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [categoryId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;