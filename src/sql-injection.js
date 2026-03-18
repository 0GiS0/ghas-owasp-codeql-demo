// OWASP A03:2021 - Injection (SQL Injection)
// CWE-89: SQL Injection
// CodeQL query: js/sql-injection
const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();

const db = new sqlite3.Database(':memory:');

db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)');

// VULNERABLE: SQL Injection - user input concatenated directly into query
router.get('/users', (req, res) => {
  const username = req.query.username;
  const query = "SELECT * FROM users WHERE username = '" + username + "'";
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// VULNERABLE: SQL Injection in INSERT statement
router.post('/users', (req, res) => {
  const { username, email } = req.body;
  const query = `INSERT INTO users (username, email) VALUES ('${username}', '${email}')`;
  db.run(query, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User created' });
  });
});

module.exports = router;
