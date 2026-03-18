// OWASP A01:2025 - Broken Access Control (Path Traversal)
// CWE-22: Path Traversal
// CodeQL queries: js/path-injection
const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// VULNERABLE: Path traversal - user input used directly in file path
router.get('/download', (req, res) => {
  const filename = req.query.file;
  const filePath = path.join('/var/data/uploads', filename);
  res.sendFile(filePath);
});

// VULNERABLE: Reading arbitrary files via path traversal
router.get('/read', (req, res) => {
  const filename = req.query.name;
  fs.readFile('data/' + filename, 'utf8', (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.send(data);
  });
});

module.exports = router;
