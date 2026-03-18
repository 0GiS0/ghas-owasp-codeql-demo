// ✅ CUMPLE CON LA POLÍTICA DE SEGURIDAD BANCARIA
// Todas las operaciones sensibles están precedidas por una llamada
// de validación de contexto (validateContext, validateSession o verifyAuthorization).
//
// La query personalizada de CodeQL (custom/missing-context-validation)
// NO debe reportar ninguna alerta en este archivo.

const express = require('express');
const router = express.Router();
const {
  validateContext, validateSession, verifyAuthorization,
  executeTransaction, transferFunds, processPayment, approveCredit, withdrawFunds
} = require('./services/bank-service');

// ✅ Valida contexto antes de ejecutar transacción
router.post('/bank/transfer', (req, res) => {
  const { userId, sessionToken, fromAccount, toAccount, amount } = req.body;

  validateContext(userId, sessionToken);
  const result = executeTransaction(fromAccount, toAccount, amount);

  res.json(result);
});

// ✅ Valida sesión antes de procesar pago
router.post('/bank/payment', (req, res) => {
  const { sessionToken, merchantId, amount, cardToken } = req.body;

  validateSession(sessionToken);
  const result = processPayment(merchantId, amount, cardToken);

  res.json(result);
});

// ✅ Doble validación antes de transferencia internacional
router.post('/bank/international-transfer', (req, res) => {
  const { userId, sessionToken, source, target, amount, currency } = req.body;

  validateContext(userId, sessionToken);
  verifyAuthorization(userId, 'INTERNATIONAL_TRANSFER');
  const result = transferFunds(source, target, amount, currency);

  res.json(result);
});

// ✅ Validación completa antes de aprobar crédito
router.post('/bank/credit', (req, res) => {
  const { userId, sessionToken, amount, term } = req.body;

  validateContext(userId, sessionToken);
  verifyAuthorization(userId, 'APPROVE_CREDIT');
  const result = approveCredit(userId, amount, term);

  res.json(result);
});

// ✅ Validación antes de retiro
router.post('/bank/withdrawal', (req, res) => {
  const { userId, sessionToken, accountId, amount } = req.body;

  validateSession(sessionToken);
  verifyAuthorization(userId, 'WITHDRAW');
  const result = withdrawFunds(accountId, amount);

  res.json(result);
});

module.exports = router;
