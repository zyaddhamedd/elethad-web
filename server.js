const express = require('express');
const next = require('next');
const path = require('path');

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, port });
const handle = app.getRequestHandler();

// Load environment variables only in development
if (dev) {
  require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });
}



app.prepare().then(async () => {
  const server = express();

  // Import backend modules securely
  const backendApp = require('./backend/src/app');
  const { initDB } = require('./backend/src/db');
  
  try {
    // Run database initialization exactly once on combined startup
    await initDB();
    console.log('✅ PostgreSQL DB verified/initialized successfully via server.js');
  } catch (err) {
    console.error('❌ DB initialization failed in server.js', err);
    process.exit(1);
  }

  // Mount backend API routes under /backend to avoid conflicts with Next.js /api folder
  // Note: the backend uses its own internal routing logic starting from the root of this mount point.
  server.use('/backend', backendApp);

  // Let Next.js handle all other routes (frontend pages, /api proxy routes, assets)
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
