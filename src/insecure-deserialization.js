// OWASP A08:2025 - Software or Data Integrity Failures
// CWE-502: Deserialization of Untrusted Data
// CodeQL queries: js/unsafe-deserialization
const express = require('express');
const serialize = require('node-serialize');
const router = express.Router();

// VULNERABLE: Unsafe deserialization of user-controlled input
router.post('/profile', (req, res) => {
  const cookie = req.cookies.profile;
  if (cookie) {
    const profileData = Buffer.from(cookie, 'base64').toString();
    const profile = serialize.unserialize(profileData);
    res.json(profile);
  } else {
    res.json({ error: 'No profile cookie found' });
  }
});

// VULNERABLE: Deserializing user input from request body
router.post('/import', (req, res) => {
  const data = req.body.serializedData;
  const obj = serialize.unserialize(data);
  res.json({ imported: obj });
});

module.exports = router;
