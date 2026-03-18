// OWASP A05:2021 - Security Misconfiguration
// CWE-942: CORS Misconfiguration
// CWE-295: Improper Certificate Validation
// CodeQL queries: js/cors-misconfiguration-for-credentials, js/disabling-certificate-validation
const express = require('express');
const https = require('https');
const router = express.Router();

// VULNERABLE: CORS misconfiguration - reflecting origin with credentials
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// VULNERABLE: Disabling TLS certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// VULNERABLE: Ignoring certificate errors in HTTPS request
router.get('/external', (req, res) => {
  const options = {
    hostname: 'api.example.com',
    path: '/data',
    rejectUnauthorized: false // Disabling certificate validation
  };
  https.get(options, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => data += chunk);
    apiRes.on('end', () => res.send(data));
  });
});

module.exports = router;
