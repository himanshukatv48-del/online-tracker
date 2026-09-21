const express = require('express');
const geoip = require('geoip-lite');
const app = express();

app.set('trust proxy', true);

const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

app.get('/track.png', (req, res) => {
  const emailId = req.query.id;
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  // Lookup approximate location based on IP
  const geo = geoip.lookup(ip);
  const location = geo ? `${geo.city || 'Unknown City'}, ${geo.region || 'Unknown Region'}, ${geo.country || 'Unknown Country'}` : 'Unknown Location (Proxy/Private IP)';

  console.log(`[OPEN RECORDED] Email ID: ${emailId} | Time: ${new Date().toISOString()} | Location: ${location} | IP: ${ip} | UA: ${userAgent}`);

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.send(transparentPng);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));