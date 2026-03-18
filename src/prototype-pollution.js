// OWASP A05:2025 - Injection (Prototype Pollution)
// CWE-1321: Improperly Controlled Modification of Object Prototype Attributes
// CodeQL queries: js/prototype-pollution, js/prototype-polluting-assignment
const express = require('express');
const router = express.Router();

// VULNERABLE: Prototype pollution via recursive merge
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// VULNERABLE: Accepting user input into merge function
router.post('/settings', (req, res) => {
  const defaults = { theme: 'light', language: 'en' };
  const userSettings = req.body;
  // An attacker can send: {"__proto__": {"isAdmin": true}}
  const settings = merge(defaults, userSettings);
  res.json(settings);
});

module.exports = router;
