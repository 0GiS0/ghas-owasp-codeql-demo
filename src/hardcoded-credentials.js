// OWASP A07:2021 - Identification and Authentication Failures
// CWE-798: Use of Hardcoded Credentials
// CWE-259: Hardcoded Password
// CodeQL queries: js/hardcoded-credentials
const express = require('express');
const https = require('https');
const router = express.Router();

// VULNERABLE: Hardcoded credentials used in authentication
router.get('/admin', (req, res) => {
  const { user, pass } = req.query;
  if (user === 'admin' && pass === 'SuperSecret123!') {
    res.json({ message: 'Authenticated' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// VULNERABLE: Hardcoded credentials in HTTP request
router.get('/external-api', (req, res) => {
  const options = {
    hostname: 'api.example.com',
    path: '/data',
    headers: {
      'Authorization': 'Bearer sk-1234567890abcdef1234567890abcdef'
    }
  };
  https.get(options, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => data += chunk);
    apiRes.on('end', () => res.json(JSON.parse(data)));
  });
});

// VULNERABLE: Hardcoded database credentials passed to connection
const mysql = require('mysql');
function getConnection() {
  return mysql.createConnection({
    host: 'db.production.internal',
    user: 'root',
    password: 'r00t_pr0d_p4ss!'
  });
}

module.exports = router;
