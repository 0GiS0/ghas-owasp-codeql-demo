// OWASP A01:2021 - Broken Access Control (Open Redirect)
// CWE-601: URL Redirection to Untrusted Site
// CodeQL queries: js/server-side-unvalidated-url-redirection
const express = require('express');
const router = express.Router();

// VULNERABLE: Open redirect - user-controlled redirect URL
router.get('/login', (req, res) => {
  const returnUrl = req.query.returnUrl;
  // After "authentication", redirect to user-supplied URL
  res.redirect(returnUrl);
});

// VULNERABLE: Open redirect via header
router.get('/goto', (req, res) => {
  const destination = req.query.dest;
  res.writeHead(302, { Location: destination });
  res.end();
});

module.exports = router;
