// OWASP A10:2021 - Server-Side Request Forgery (SSRF)
// CWE-918: Server-Side Request Forgery
// CodeQL queries: js/request-forgery, js/client-side-request-forgery
const express = require('express');
const axios = require('axios');
const http = require('http');
const router = express.Router();

// VULNERABLE: SSRF - user-controlled URL fetched server-side
router.get('/fetch', async (req, res) => {
  const url = req.query.url;
  try {
    const response = await axios.get(url);
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VULNERABLE: SSRF via proxy endpoint
router.get('/proxy', (req, res) => {
  const target = req.query.target;
  http.get(target, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => data += chunk);
    proxyRes.on('end', () => res.send(data));
  }).on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

module.exports = router;
