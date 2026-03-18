// Módulo de servicio bancario con operaciones sensibles y funciones de validación
//
// POLÍTICA DE SEGURIDAD:
// Toda operación sensible (executeTransaction, transferFunds, processPayment,
// approveCredit, withdrawFunds) DEBE estar precedida por una llamada a
// validateContext(), validateSession() o verifyAuthorization() en la misma función.
//
// La query personalizada de CodeQL (custom/missing-context-validation)
// verifica automáticamente el cumplimiento de esta política.

// --- Funciones de Validación de Contexto ---

/**
 * Valida la sesión del usuario y su contexto de autorización.
 * DEBE llamarse antes de cualquier operación bancaria sensible.
 */
function validateContext(userId, sessionToken) {
  if (!userId || !sessionToken) {
    throw new Error('userId y sessionToken son obligatorios');
  }
  if (sessionToken.expired) {
    throw new Error('Sesión expirada - reautenticación necesaria');
  }
  console.log(`[VALIDATE] Contexto validado para usuario ${userId}`);
  return true;
}

/**
 * Valida que el token de sesión sea válido y no haya expirado.
 */
function validateSession(sessionToken) {
  if (!sessionToken) {
    throw new Error('Token de sesión no proporcionado');
  }
  console.log('[VALIDATE] Sesión validada correctamente');
  return true;
}

/**
 * Verifica que el usuario tiene el permiso especificado.
 */
function verifyAuthorization(userId, permission) {
  if (!userId || !permission) {
    throw new Error('userId y permission son obligatorios');
  }
  console.log(`[AUTHORIZE] Usuario ${userId} autorizado para: ${permission}`);
  return true;
}

// --- Operaciones Bancarias Sensibles ---

function executeTransaction(fromAccount, toAccount, amount) {
  console.log(`[TX] Transacción: ${fromAccount} → ${toAccount}: $${amount}`);
  return { success: true, transactionId: Date.now() };
}

function transferFunds(sourceAccount, targetAccount, amount, currency) {
  console.log(`[TRANSFER] ${amount} ${currency}: ${sourceAccount} → ${targetAccount}`);
  return { success: true, transferId: Date.now() };
}

function processPayment(merchantId, amount, cardToken) {
  console.log(`[PAYMENT] $${amount} al comercio ${merchantId}`);
  return { success: true, paymentId: Date.now() };
}

function approveCredit(customerId, amount, term) {
  console.log(`[CREDIT] Crédito aprobado: $${amount} a ${term} meses para ${customerId}`);
  return { approved: true, creditId: Date.now() };
}

function withdrawFunds(accountId, amount) {
  console.log(`[WITHDRAW] Retiro de $${amount} de cuenta ${accountId}`);
  return { success: true, withdrawalId: Date.now() };
}

module.exports = {
  // Funciones de validación
  validateContext,
  validateSession,
  verifyAuthorization,
  // Operaciones sensibles
  executeTransaction,
  transferFunds,
  processPayment,
  approveCredit,
  withdrawFunds
};
