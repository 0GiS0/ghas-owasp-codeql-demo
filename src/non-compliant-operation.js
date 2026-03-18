// ❌ NO CUMPLE CON LA POLÍTICA DE SEGURIDAD BANCARIA
// Las operaciones sensibles se ejecutan SIN validación de contexto previa.
// La query personalizada de CodeQL (custom/missing-context-validation)
// DEBE reportar una alerta por cada operación sensible en este archivo.

const express = require('express');
const router = express.Router();
const {
  executeTransaction, transferFunds, processPayment, approveCredit, withdrawFunds
} = require('./services/bank-service');

// ❌ Transacción SIN validación de contexto
router.post('/bank/quick-transfer', (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;

  // ⚠️ Falta: validateContext() o validateSession()
  const result = executeTransaction(fromAccount, toAccount, amount);

  res.json(result);
});

// ❌ Pago SIN validación de sesión
router.post('/bank/quick-payment', (req, res) => {
  const { merchantId, amount, cardToken } = req.body;

  // ⚠️ Falta: validateSession()
  const result = processPayment(merchantId, amount, cardToken);

  res.json(result);
});

// ❌ Transferencia SIN verificación de autorización
router.post('/bank/batch-transfer', (req, res) => {
  const { source, target, amount, currency } = req.body;

  // ⚠️ Falta: validateContext() y verifyAuthorization()
  const result = transferFunds(source, target, amount, currency);

  res.json(result);
});

// ❌ Aprobación de crédito SIN ninguna validación
router.post('/bank/auto-credit', (req, res) => {
  const { customerId, amount, term } = req.body;

  // ⚠️ Falta: validateContext() y verifyAuthorization()
  const result = approveCredit(customerId, amount, term);

  res.json(result);
});

// ❌ Retiro SIN validación
router.post('/bank/quick-withdrawal', (req, res) => {
  const { accountId, amount } = req.body;

  // ⚠️ Falta: validateSession() y verifyAuthorization()
  const result = withdrawFunds(accountId, amount);

  res.json(result);
});

module.exports = router;
