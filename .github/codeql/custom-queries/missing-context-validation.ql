/**
 * @name Operación bancaria sensible sin validación de contexto
 * @description Detecta llamadas a operaciones bancarias sensibles que no están
 *              precedidas por una llamada de validación de contexto en la misma función.
 *              En entornos bancarios, toda operación crítica debe validar el contexto
 *              (sesión, autorización) antes de ejecutarse.
 * @kind problem
 * @problem.severity error
 * @precision high
 * @id custom/missing-context-validation
 * @tags security
 *       banking
 *       compliance
 *       custom
 */

import javascript

/**
 * Nombres de operaciones bancarias sensibles.
 * Cualquier llamada a estas funciones DEBE estar precedida
 * por una validación de contexto en la misma función.
 */
predicate isSensitiveOperationName(string name) {
  name = "executeTransaction" or
  name = "transferFunds" or
  name = "processPayment" or
  name = "approveCredit" or
  name = "withdrawFunds"
}

/**
 * Nombres de funciones de validación de contexto.
 * Al menos una de estas debe aparecer antes de cualquier operación sensible.
 */
predicate isValidationFunctionName(string name) {
  name = "validateContext" or
  name = "validateSession" or
  name = "verifyAuthorization"
}

/**
 * Obtiene el nombre de la función llamada, sea como llamada directa
 * (executeTransaction(...)) o como método (bankService.executeTransaction(...))
 */
string getCallName(CallExpr call) {
  result = call.getCalleeName()
  or
  exists(DotExpr dot |
    dot = call.getCallee() and
    result = dot.getPropertyName()
  )
}

from CallExpr sensitiveCall, Function enclosingFunc, string opName
where
  // Identificar llamadas a operaciones sensibles
  opName = getCallName(sensitiveCall) and
  isSensitiveOperationName(opName) and
  // Obtener la función que contiene la llamada
  enclosingFunc = sensitiveCall.getEnclosingFunction() and
  // Verificar que NO existe una llamada de validación ANTES en la misma función
  not exists(CallExpr validationCall, string valName |
    valName = getCallName(validationCall) and
    isValidationFunctionName(valName) and
    validationCall.getEnclosingFunction() = enclosingFunc and
    validationCall.getLocation().getStartLine() < sensitiveCall.getLocation().getStartLine()
  )
select sensitiveCall,
  "La operación bancaria sensible '" + opName +
  "' se ejecuta sin validación de contexto previa. " +
  "Añade una llamada a validateContext(), validateSession() o verifyAuthorization() antes de esta operación."
