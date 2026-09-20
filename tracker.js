const express = require('express');
const app = express();

// Enable trust proxy so Render passes through the real client IP
app.set('trust proxy', true);

// 1x1 transparent PNG binary buffer
const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

app.get('/track.png', (req, res) => {
  const emailId = req.query.id;
  
  // Extract real client IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  // Log open event
  console.log(`[OPEN RECORDED] Email ID: ${emailId} | Time: ${new Date().toISOString()} | IP: ${ip} | UA: ${userAgent}`);

  // Set response headers to prevent caching across clients
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  // Serve pixel
  res.send(transparentPng);
});

// Dynamic port assignment for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tracking server running on port ${PORT}`));