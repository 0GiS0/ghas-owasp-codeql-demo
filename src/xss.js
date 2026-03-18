// OWASP A05:2025 - Injection (Cross-Site Scripting)
// CWE-79: XSS (Reflected)
// CodeQL queries: js/reflected-xss, js/xss, js/xss-through-dom
const express = require('express');
const router = express.Router();

// VULNERABLE: Reflected XSS - user input rendered directly in HTML response
router.get('/search', (req, res) => {
  const query = req.query.q;
  res.send(`
    <html>
      <body>
        <h1>Resultados de búsqueda</h1>
        <p>Mostrando resultados para: ${query}</p>
      </body>
    </html>
  `);
});

// VULNERABLE: Stored XSS - user input stored and rendered without sanitization
const comments = [];

router.post('/comments', (req, res) => {
  const { author, text } = req.body;
  comments.push({ author, text });
  res.json({ message: 'Comment added' });
});

router.get('/comments', (req, res) => {
  let html = '<html><body><h1>Comentarios</h1>';
  comments.forEach(c => {
    html += `<div><strong>${c.author}</strong>: ${c.text}</div>`;
  });
  html += '</body></html>';
  res.send(html);
});

module.exports = router;
