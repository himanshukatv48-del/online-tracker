const express = require('express');
const app = express();

app.set('trust proxy', true);

const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

app.get('/track.png', async (req, res) => {
  const emailId = req.query.id;
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';

  let location = 'Unknown Location';
  const isGoogleProxy = userAgent.includes('via ggpht.com GoogleImageProxy');

  if (isGoogleProxy) {
    location = 'Gmail Proxy (Location Masked by Google)';
  } else if (ip && !ip.includes('127.0.0.1') && !ip.includes('::1')) {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`);
      const data = await response.json();
      if (data && data.status === 'success') {
        location = `${data.city}, ${data.regionName}, ${data.country}`;
      }
    } catch (err) {
      location = 'Geo Lookup Failed';
    }
  }

  console.log(`[OPEN RECORDED] Email ID: ${emailId} | Time: ${new Date().toISOString()} | Location: ${location} | IP: ${ip} | UA: ${userAgent}`);

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.send(transparentPng);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));