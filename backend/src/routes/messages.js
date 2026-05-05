const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const verifyToken = require('../middleware/auth');

const VALID_STATUSES = ['new', 'read', 'replied'];

function normalizeMessage(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    province: row.province || null,
    service: row.service || null,
    message: row.message || null,
    status: row.status,
    created_at: row.created_at,
  };
}

// GET /api/messages — list all (admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );
    res.json(result.rows.map(normalizeMessage));
  } catch (err) {
    console.error('GET /api/messages error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/messages — submit contact form
router.post('/', async (req, res) => {
  const { name, phone, province, service, message } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'الاسم مطلوب' });
  }
  if (!phone || !String(phone).trim()) {
    return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO messages (name, phone, province, service, message, status)
       VALUES ($1, $2, $3, $4, $5, 'new')
       RETURNING *`,
      [
        String(name).trim(),
        String(phone).trim(),
        province ? String(province).trim() : null,
        service  ? String(service).trim()  : null,
        message  ? String(message).trim()  : null,
      ]
    );
    res.status(201).json(normalizeMessage(result.rows[0]));
  } catch (err) {
    console.error('POST /api/messages error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// PATCH /api/messages/:id — update status
router.patch('/:id', verifyToken, async (req, res) => {
  const messageId = Number(req.params.id);
  if (Number.isNaN(messageId)) {
    return res.status(400).json({ error: 'Invalid message id' });
  }

  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const result = await pool.query(
      'UPDATE messages SET status = $1 WHERE id = $2 RETURNING *',
      [status, messageId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(normalizeMessage(result.rows[0]));
  } catch (err) {
    console.error('PATCH /api/messages/:id error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', verifyToken, async (req, res) => {
  const messageId = Number(req.params.id);
  if (Number.isNaN(messageId)) {
    return res.status(400).json({ error: 'Invalid message id' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 RETURNING *',
      [messageId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/messages/:id error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
