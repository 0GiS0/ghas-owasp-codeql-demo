// OWASP A07:2021 - Identification and Authentication Failures
// CWE-798: Use of Hardcoded Credentials
// CWE-259: Hardcoded Password
// CodeQL queries: js/hardcoded-credentials
const express = require('express');
const router = express.Router();

// VULNERABLE: Hardcoded credentials in source code
const DB_USER = 'admin';
const DB_PASSWORD = 'SuperSecret123!';
const API_KEY = 'sk-1234567890abcdef1234567890abcdef';

// VULNERABLE: Hardcoded connection string with credentials
const connectionString = 'mongodb://admin:password123@db.example.com:27017/production';

// VULNERABLE: Hardcoded credentials in configuration object
const config = {
  database: {
    host: 'db.production.internal',
    port: 5432,
    username: 'postgres',
    password: 'p0stgr3s_pr0d!'
  },
  smtp: {
    host: 'smtp.gmail.com',
    auth: {
      user: 'app@company.com',
      pass: 'email_password_2024'
    }
  }
};

router.get('/admin', (req, res) => {
  const { user, pass } = req.query;
  if (user === DB_USER && pass === DB_PASSWORD) {
    res.json({ message: 'Authenticated', token: API_KEY });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
