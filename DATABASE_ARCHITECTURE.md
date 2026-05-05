# Database Architecture & Visual Guide

## Database Diagram (ASCII)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ELETHAD BACKEND DATABASE                         │
│                          PostgreSQL Schema                              │
└─────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────┐
                         │   categories     │
                         ├──────────────────┤
                         │ id (PK)          │
                         │ slug (UNIQUE)    │
                         │ name_ar          │
                         │ name_en          │
                         │ description      │
                         │ image_url        │
                         │ featured         │
                         │ display_order    │
                         │ created_at       │
                         │ updated_at       │
                         └────────┬─────────┘
                                  │ 1:N
                                  │
                    ┌─────────────▼──────────────────┐
                    │       products                 │
                    ├────────────────────────────────┤
                    │ id (PK)                        │
                    │ slug (UNIQUE)                  │
                    │ name_ar                        │
                    │ name_en                        │
                    │ category_id (FK) ─────────┐   │
                    │ price                      │   │
                    │ discount_price             │   │
                    │ description_ar             │   │
                    │ description_en             │   │
                    │ image_url                  │   │
                    │ sku (UNIQUE)               │   │
                    │ stock_quantity             │   │
                    │ average_rating             │   │
                    │ reviews_count              │   │
                    │ is_active                  │   │
                    │ is_featured                │   │
                    │ created_at                 │   │
                    │ updated_at                 │   │
                    │ deleted_at                 │   │
                    └────┬──────────────┬────────┘   │
                         │              │ 1:N        │
                         │              │            │
        ┌────────────────▼──┐  ┌───────▼──────────┐  │
        │ product_images    │  │ product_details  │  │
        ├───────────────────┤  ├──────────────────┤  │
        │ id (PK)           │  │ id (PK)          │  │
        │ product_id (FK)   │  │ product_id (FK)  │  │
        │ image_url         │  │ type             │  │
        │ alt_text_ar       │  │ label_ar         │  │
        │ alt_text_en       │  │ label_en         │  │
        │ display_order     │  │ value_ar         │  │
        │ is_primary        │  │ value_en         │  │
        │ created_at        │  │ display_order    │  │
        └───────────────────┘  │ created_at       │  │
                               └──────────────────┘  │
                                                      │
                    ┌─────────────────────────────────┘
                    │
        ┌───────────▼──────────────┐
        │      reviews             │
        ├──────────────────────────┤
        │ id (PK)                  │
        │ product_id (FK)          │
        │ customer_id (FK)         │
        │ rating (1-5)             │
        │ title                    │
        │ content                  │
        │ verified_purchase        │
        │ helpful_count            │
        │ status (pending/approved)│
        │ approved_by_user_id (FK) │
        │ created_at               │
        │ updated_at               │
        └──────────────────────────┘


                    ┌──────────────────┐
                    │   customers      │
                    ├──────────────────┤
                    │ id (PK)          │
                    │ email (UNIQUE)   │
                    │ phone (UNIQUE)   │
                    │ name_ar          │
                    │ name_en          │
                    │ address          │
                    │ governorate      │
                    │ city             │
                    │ password_hash    │
                    │ is_registered    │
                    │ marketing_consent│
                    │ created_at       │
                    │ updated_at       │
                    └────────┬─────────┘
                             │ 1:N
                             │
        ┌────────────────────▼────────────────────┐
        │           orders                        │
        ├─────────────────────────────────────────┤
        │ id (PK)                                 │
        │ order_number (UNIQUE)                   │
        │ customer_id (FK) ─────────────┐         │
        │ customer_name                 │         │
        │ customer_email                │         │
        │ customer_phone                │         │
        │ delivery_address              │         │
        │ governorate                   │         │
        │ delivery_notes                │         │
        │ subtotal                      │         │
        │ shipping_cost                 │         │
        │ discount                      │         │
        │ tax                           │         │
        │ total                         │         │
        │ payment_method                │         │
        │ payment_status                │         │
        │ payment_reference             │         │
        │ status (pending/shipped/...)  │         │
        │ tracking_number               │         │
        │ shipped_at                    │         │
        │ delivered_at                  │         │
        │ assigned_to_user_id (FK) ──┐ │         │
        │ internal_notes              │ │         │
        │ created_at                  │ │         │
        │ updated_at                  │ │         │
        │ cancelled_at                │ │         │
        └────┬──────────────────────┬─┘ │         │
             │ 1:N                  │    │         │
             │                      │    │         │
    ┌────────▼────────────┐         │    │         │
    │   order_items       │         │    │         │
    ├─────────────────────┤         │    │         │
    │ id (PK)             │         │    │         │
    │ order_id (FK)       │         │    │         │
    │ product_id (FK)     │         │    │         │
    │ product_name_snap   │         │    │         │
    │ product_image_snap  │         │    │         │
    │ quantity            │         │    │         │
    │ unit_price          │         │    │         │
    │ line_total          │         │    │         │
    │ created_at          │         │    │         │
    └─────────────────────┘         │    │         │
                                    │    │         │
          ┌─────────────────────────┘    │         │
          │                              │         │
    ┌─────▼──────────────────────────────┼────────┘
    │ order_status_history                │
    ├──────────────────────────────────────┤
    │ id (PK)                              │
    │ order_id (FK)                        │
    │ old_status                           │
    │ new_status                           │
    │ changed_by_user_id (FK) ──────────┐ │
    │ note                               │ │
    │ created_at                         │ │
    └──────────────────────────────────────┤
                                           │
                                           │
                    ┌──────────────────────┤
                    │                      │
        ┌───────────▼─────────────┐        │
        │    messages/contacts    │        │
        ├────────────────────────┤        │
        │ id (PK)                │        │
        │ message_number (UNIQUE)│        │
        │ sender_name            │        │
        │ sender_email           │        │
        │ sender_phone           │        │
        │ governorate            │        │
        │ service_type           │        │
        │ subject                │        │
        │ message                │        │
        │ status                 │        │
        │ priority               │        │
        │ response_message       │        │
        │ responded_by_user_id   │──────┐ │
        │ responded_at           │      │ │
        │ assigned_to_user_id    │──┐   │ │
        │ created_at             │  │   │ │
        │ updated_at             │  │   │ │
        └────────────────────────┘  │   │ │
                                    │   │ │
                    ┌───────────────┴─┬─┘ │
                    │                 │    │
                    │  ┌──────────────┘    │
                    │  │                   │
    ┌───────────────▼──▼──────────────────┘
    │      admin_users
    ├──────────────────────────
    │ id (PK)
    │ email (UNIQUE)
    │ password_hash
    │ full_name
    │ role (admin/manager/support/sales)
    │ permissions (JSONB)
    │ is_active
    │ last_login_at
    │ created_at
    │ updated_at
    └──────────────────────────


        ┌──────────────────────┐
        │   testimonials       │
        ├──────────────────────┤
        │ id (PK)              │
        │ name_ar              │
        │ name_en              │
        │ role_ar              │
        │ role_en              │
        │ content_ar           │
        │ content_en           │
        │ rating (1-5)         │
        │ image_url            │
        │ is_featured          │
        │ display_order        │
        │ created_at           │
        │ updated_at           │
        └──────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER JOURNEY & DATA FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

CUSTOMER FLOW:
───────────────

1. Browse Products
   ┌──────────────────┐
   │ Frontend (SPA)   │
   └────────┬─────────┘
            │ GET /api/products
            ▼
   ┌──────────────────────────────┐
   │ Backend API                  │
   │ - Query products table       │
   │ - Filter by category/search  │
   │ - Sort & paginate            │
   └────────┬─────────────────────┘
            │ JSON response
            ▼
   ┌──────────────────┐
   │ Display Products │
   │ on Frontend      │
   └──────────────────┘


2. View Product Details
   ┌──────────────────┐
   │ Click Product    │
   └────────┬─────────┘
            │ GET /api/products/:id
            ▼
   ┌──────────────────────────────┐
   │ Backend fetches:             │
   │ - Product details            │
   │ - Images                     │
   │ - Specs/Features             │
   │ - Reviews                    │
   └────────┬─────────────────────┘
            │ JSON response
            ▼
   ┌──────────────────┐
   │ Show Detail Page │
   │ + Reviews        │
   └──────────────────┘


3. Add to Cart
   ┌──────────────────┐
   │ Add to Cart      │
   └────────┬─────────┘
            │ Store in localStorage
            │ (or POST /api/cart)
            ▼
   ┌──────────────────┐
   │ Cart Updated     │
   │ Show in Drawer   │
   └──────────────────┘


4. Checkout
   ┌──────────────────────┐
   │ Fill Checkout Form   │
   │ - Name, phone, etc   │
   │ - Select payment     │
   └────────┬─────────────┘
            │ POST /api/orders
            ▼
   ┌──────────────────────────────────────┐
   │ Backend processes:                   │
   │ 1. Create customer (if new)          │
   │ 2. Create order record               │
   │ 3. Create order_items                │
   │ 4. Process payment (if online)       │
   │ 5. Send confirmation email           │
   │ 6. Notify admin                      │
   └────────┬──────────────────────────────┘
            │ Order ID & status
            ▼
   ┌──────────────────┐
   │ Show Success     │
   │ + Order Details  │
   └──────────────────┘


5. Track Order
   ┌──────────────────┐
   │ Enter Order ID   │
   └────────┬─────────┘
            │ GET /api/orders/:order_id
            ▼
   ┌──────────────────────────────┐
   │ Backend fetches order:       │
   │ - Status                     │
   │ - Items                      │
   │ - Tracking info              │
   │ - Timeline                   │
   └────────┬─────────────────────┘
            │ JSON response
            ▼
   ┌──────────────────┐
   │ Show Order       │
   │ Tracking Page    │
   └──────────────────┘


ADMIN FLOW:
───────────

1. Login
   ┌──────────────────┐
   │ Enter Credentials│
   └────────┬─────────┘
            │ POST /api/auth/login
            ▼
   ┌──────────────────────────────┐
   │ Backend verifies:            │
   │ - Check email/password       │
   │ - Generate JWT token         │
   │ - Return token               │
   └────────┬─────────────────────┘
            │ JWT token
            ▼
   ┌──────────────────┐
   │ Store token      │
   │ Access Dashboard │
   └──────────────────┘


2. Dashboard Overview
   ┌──────────────────┐
   │ Load Dashboard   │
   └────────┬─────────┘
            │ GET /api/admin/dashboard
            │ (with JWT token)
            ▼
   ┌──────────────────────────────┐
   │ Backend computes:            │
   │ - Total orders               │
   │ - Revenue                    │
   │ - Pending orders             │
   │ - New messages               │
   │ - Recent orders (10)         │
   │ - Recent messages (5)        │
   └────────┬─────────────────────┘
            │ Dashboard data
            ▼
   ┌──────────────────┐
   │ Display KPIs &   │
   │ Recent Items     │
   └──────────────────┘


3. Manage Orders
   ┌──────────────────┐
   │ View All Orders  │
   └────────┬─────────┘
            │ GET /api/admin/orders?status=pending
            ▼
   ┌──────────────────────────────┐
   │ Backend lists pending orders │
   └────────┬─────────────────────┘
            │ Order list
            ▼
   ┌────────────────────────┐
   │ Update Order Status    │
   │ (e.g., confirm order)  │
   └────────┬───────────────┘
            │ PATCH /api/orders/:id
            │ {status: "processing"}
            ▼
   ┌──────────────────────────────┐
   │ Backend updates:             │
   │ - Orders.status              │
   │ - Log to status_history      │
   │ - Send customer email        │
   │ - Notify warehouse           │
   └────────┬─────────────────────┘
            │ Success response
            ▼
   ┌────────────────────┐
   │ Show confirmation  │
   │ Update UI          │
   └────────────────────┘
```

---

## API Response Pattern

All API responses follow this structure:

```json
{
  "success": true|false,
  "data": {},
  "message": "Optional message",
  "error": "Optional error message",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "timestamp": "2026-05-03T15:30:00Z"
  }
}
```

---

## Database Indexes Strategy

```sql
-- Read-heavy queries (Product listings)
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price ASC, price DESC);

-- Search queries
CREATE INDEX idx_products_name_search ON products USING GIN (to_tsvector('arabic', name_ar));
CREATE INDEX idx_products_slug ON products(slug);

-- Order queries
CREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at DESC);
CREATE INDEX idx_orders_status_date ON orders(status, created_at DESC);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Message queries
CREATE INDEX idx_messages_status_date ON messages(status, created_at DESC);
CREATE INDEX idx_messages_assigned_to ON messages(assigned_to_user_id);

-- Review queries
CREATE INDEX idx_reviews_product_status ON reviews(product_id, status);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- Customer queries
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
```

---

## Query Performance Tips

### Slow Query Example ❌
```sql
-- N+1 Problem: Fetches product for each order item
SELECT * FROM order_items;
-- Then loops: SELECT * FROM products WHERE id = ?;
```

### Optimized Query ✓
```sql
-- Use JOIN to fetch everything at once
SELECT oi.*, p.name_ar, p.price, p.image_url
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = $1;
```

---

## Admin Roles & Permissions

```javascript
const roles = {
  admin: {
    permissions: ['*'], // All permissions
  },
  manager: {
    permissions: [
      'order:read',
      'order:update',
      'product:read',
      'product:create',
      'product:update',
      'message:read',
      'message:respond',
      'customer:read',
      'analytics:read',
    ],
  },
  support: {
    permissions: [
      'order:read',
      'order:update_status',
      'message:read',
      'message:respond',
      'customer:read',
    ],
  },
  sales: {
    permissions: [
      'product:read',
      'order:read',
      'customer:read',
      'analytics:read',
    ],
  },
};
```

---

## Error Codes

```
200 OK - Success
201 Created - Resource created
400 Bad Request - Invalid input
401 Unauthorized - No/invalid token
403 Forbidden - Not enough permissions
404 Not Found - Resource doesn't exist
409 Conflict - Duplicate record
422 Unprocessable Entity - Validation failed
429 Too Many Requests - Rate limited
500 Internal Server Error - Server error
503 Service Unavailable - Server down
```

---

## Security Best Practices

```
✓ Use HTTPS only
✓ Hash passwords with bcrypt
✓ Use JWT with expiration
✓ Validate all inputs
✓ Sanitize outputs
✓ Use prepared statements (prevent SQL injection)
✓ Implement rate limiting
✓ CORS only for trusted origins
✓ Use environment variables for secrets
✓ Implement CSRF protection
✓ Log audit trails
✓ Regular security updates
✓ SQL injection prevention
✓ XSS prevention
✓ CSRF protection
```

---

## Performance Targets

- **API Response Time:** < 200ms for 95th percentile
- **Database Query Time:** < 100ms for most queries
- **Server Throughput:** 1000+ concurrent connections
- **Database Connections:** Pool size 20-30

---

## Monitoring & Logging

Key metrics to track:
- API response times
- Error rates
- Database query times
- Server CPU/Memory usage
- Active users
- Order creation rate
- Payment success rate
- Message response time

Recommended tools:
- **APM:** New Relic, Datadog, or Sentry
- **Logging:** ELK Stack, Splunk, or LogRocket
- **Monitoring:** Prometheus + Grafana
- **Alerts:** PagerDuty, OpsGenie

