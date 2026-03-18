// Entry point - Express application with vulnerable routes
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vulnerable routes
app.use('/api', require('./sql-injection'));
app.use('/api', require('./xss'));
app.use('/api', require('./command-injection'));
app.use('/api', require('./path-traversal'));
app.use('/api', require('./insecure-deserialization'));
app.use('/api', require('./security-misconfiguration'));
app.use('/api', require('./hardcoded-credentials'));
app.use('/api', require('./non-owasp-redos'));
app.use('/api', require('./ssrf'));
app.use('/api', require('./open-redirect'));
app.use('/api', require('./prototype-pollution'));

// Banking operations - custom CodeQL query demo
app.use('/api', require('./compliant-operation'));
app.use('/api', require('./non-compliant-operation'));

app.get('/', (req, res) => {
  res.json({
    name: 'ghas-owasp-codeql-demo',
    description: 'Aplicación vulnerable para demostrar CodeQL con OWASP Top 10',
    routes: [
      'GET  /api/users?username=       → SQL Injection',
      'GET  /api/search?q=             → Reflected XSS',
      'GET  /api/ping?host=            → Command Injection',
      'GET  /api/download?file=        → Path Traversal',
      'POST /api/profile               → Insecure Deserialization',
      'GET  /api/admin?user=&pass=     → Hardcoded Credentials',
      'GET  /api/external              → Security Misconfiguration',
      'GET  /api/validate-email?email= → ReDoS (NO OWASP - no debería detectarse)',
      'GET  /api/fetch?url=            → SSRF',
      'GET  /api/login?returnUrl=      → Open Redirect',
      'POST /api/settings              → Prototype Pollution',
      '',
      '--- Custom Banking Rules (query personalizada) ---',
      'POST /api/bank/transfer          → ✅ Con validación de contexto',
      'POST /api/bank/payment           → ✅ Con validación de contexto',
      'POST /api/bank/international-transfer → ✅ Con validación',
      'POST /api/bank/credit            → ✅ Con validación de contexto',
      'POST /api/bank/withdrawal        → ✅ Con validación de contexto',
      'POST /api/bank/quick-transfer    → ❌ SIN validación (alerta custom)',
      'POST /api/bank/quick-payment     → ❌ SIN validación (alerta custom)',
      'POST /api/bank/batch-transfer    → ❌ SIN validación (alerta custom)',
      'POST /api/bank/auto-credit       → ❌ SIN validación (alerta custom)',
      'POST /api/bank/quick-withdrawal  → ❌ SIN validación (alerta custom)'
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
