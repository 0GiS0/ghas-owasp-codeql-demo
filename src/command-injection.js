// OWASP A05:2025 - Injection (Command Injection)
// CWE-78: OS Command Injection
// CodeQL queries: js/command-line-injection, js/shell-command-constructed-from-input
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

// VULNERABLE: Command injection - user input passed directly to exec()
router.get('/ping', (req, res) => {
  const host = req.query.host;
  exec('ping -c 3 ' + host, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(`<pre>${stdout}</pre>`);
  });
});

// VULNERABLE: Command injection in file operations
router.get('/list-files', (req, res) => {
  const directory = req.query.dir;
  exec(`ls -la ${directory}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(`<pre>${stdout}</pre>`);
  });
});

module.exports = router;
