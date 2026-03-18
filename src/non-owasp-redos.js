// ⚠️ ESTA VULNERABILIDAD NO ES OWASP TOP 10
// Es un ReDoS (Regular Expression Denial of Service)
// CWE-1333: Inefficient Regular Expression Complexity
// CodeQL query: js/polynomial-redos
//
// Con "security-extended" se detectaría, pero con nuestra
// suite OWASP personalizada NO debería aparecer en Security.
const express = require('express');
const router = express.Router();

// VULNERABLE: Polynomial ReDoS - regex with catastrophic backtracking
router.get('/validate-email', (req, res) => {
  const email = req.query.email;
  // This regex has exponential backtracking on malicious input
  const emailRegex = /^([a-zA-Z0-9]+)+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
  if (emailRegex.test(email)) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// VULNERABLE: Another ReDoS pattern
router.get('/validate-url', (req, res) => {
  const url = req.query.url;
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (urlRegex.test(url)) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

module.exports = router;
