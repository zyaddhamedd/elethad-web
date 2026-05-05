require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('❌ FATAL ERROR: DATABASE_URL environment variable is required.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET environment variable is required.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const uploadsRouter = require('./routes/uploads');
const messagesRouter = require('./routes/messages');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const { initDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => res.send('API is running'));
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5050;

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
	console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
	console.error('❌ Uncaught Exception:', error);
	process.exit(1);
});

(async () => {
	try {
		await initDB();
		const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
		
		// Handle server errors
		server.on('error', (err) => {
			console.error('❌ Server error:', err);
			process.exit(1);
		});
	} catch (err) {
		console.error('❌ DB initialization failed', err);
		process.exit(1);
	}
})();
