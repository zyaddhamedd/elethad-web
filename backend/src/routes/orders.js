const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const { pool } = require('../db');
const verifyToken = require('../middleware/auth');

// ─── Screenshot upload (Cloudinary) ──────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'elethad/orders',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ fetch_format: 'auto', quality: 'auto:good', width: 1600, crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const VALID_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const VALID_PAYMENT_METHODS = ['cash', 'instapay'];

function normalizeOrder(row) {
  return {
    id: row.id,
    customer_name: row.customer_name,
    phone: row.phone,
    address: row.address,
    governorate: row.governorate,
    payment_method: row.payment_method,
    payment_screenshot_url: row.payment_screenshot_url || null,
    items: row.items || [],
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
    notes: row.notes || null,
    created_at: row.created_at,
  };
}

// ─── GET /api/orders — list all (admin) ──────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const { payment_method, status } = req.query;
    let query = 'SELECT * FROM orders';
    const conditions = [];
    const values = [];

    if (payment_method && VALID_PAYMENT_METHODS.includes(payment_method)) {
      values.push(payment_method);
      conditions.push(`payment_method = $${values.length}`);
    }
    if (status && VALID_STATUSES.includes(status)) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    res.json(result.rows.map(normalizeOrder));
  } catch (err) {
    console.error('GET /api/orders error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
router.get('/:id', verifyToken, async (req, res) => {
  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) return res.status(400).json({ error: 'Invalid order id' });

  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(normalizeOrder(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── POST /api/orders — create order (multipart/form-data) ───────────────────
router.post('/', upload.single('payment_screenshot'), async (req, res) => {
  const {
    customer_name,
    phone,
    address,
    governorate,
    payment_method = 'cash',
    items,            // JSON string
    subtotal,
    shipping,
    total,
    notes,
  } = req.body;

  // Validation
  if (!customer_name || !String(customer_name).trim()) return res.status(400).json({ error: 'الاسم مطلوب' });
  if (!phone || !String(phone).trim())                  return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
  if (!address || !String(address).trim())              return res.status(400).json({ error: 'العنوان مطلوب' });
  if (!governorate || !String(governorate).trim())      return res.status(400).json({ error: 'المحافظة مطلوبة' });
  if (!VALID_PAYMENT_METHODS.includes(payment_method))  return res.status(400).json({ error: 'طريقة الدفع غير صالحة' });
  if (payment_method === 'instapay' && !req.file)       return res.status(400).json({ error: 'صورة إيصال التحويل مطلوبة' });

  let parsedItems = [];
  try {
    parsedItems = typeof items === 'string' ? JSON.parse(items) : (items || []);
  } catch {
    return res.status(400).json({ error: 'بيانات المنتجات غير صالحة' });
  }

  // req.file.path contains the Cloudinary secure_url
  const screenshotUrl = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      `INSERT INTO orders
        (customer_name, phone, address, governorate, payment_method, payment_screenshot_url,
         items, subtotal, shipping, total, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,'pending')
       RETURNING *`,
      [
        String(customer_name).trim(),
        String(phone).trim(),
        String(address).trim(),
        String(governorate).trim(),
        payment_method,
        screenshotUrl,
        JSON.stringify(parsedItems),
        Number(subtotal) || 0,
        Number(shipping) || 0,
        Number(total) || 0,
        notes ? String(notes).trim() : null,
      ]
    );
    res.status(201).json(normalizeOrder(result.rows[0]));
  } catch (err) {
    console.error('POST /api/orders error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── PATCH /api/orders/:id — update status ───────────────────────────────────
router.patch('/:id', verifyToken, async (req, res) => {
  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) return res.status(400).json({ error: 'Invalid order id' });

  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(normalizeOrder(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ─── DELETE /api/orders/:id ───────────────────────────────────────────────────
router.delete('/:id', verifyToken, async (req, res) => {
  const orderId = Number(req.params.id);
  if (Number.isNaN(orderId)) return res.status(400).json({ error: 'Invalid order id' });

  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [orderId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    // Note: We skip deleting Cloudinary files here for simplicity and safety,
    // and we also skip deleting local files if they still exist.
    // A cleanup script can be used later if needed.

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
