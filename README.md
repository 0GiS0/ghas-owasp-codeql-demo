# 🛡️ CodeQL: reglas OWASP Top 10 + queries personalizadas 🔥

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

¡Hola developer 👋🏻! En este repo encontrarás cómo configurar **GitHub Advanced Security (GHAS)** con **CodeQL** para:

1. 🎯 Ejecutar **únicamente** las queries alineadas con un marco normativo — en este caso, el **[OWASP Top 10 (2025)](https://owasp.org/Top10/2025/0x00_2025-Introduction)**
2. 🏦 Crear **queries personalizadas** que validen reglas de negocio propias — como verificar que en un banco siempre se valide el contexto antes de ejecutar operaciones sensibles

## 🎯 ¿Por qué filtrar queries por marco normativo?

Por defecto, CodeQL ejecuta cientos de queries de seguridad. Esto es útil, pero en ciertos contextos necesitas:

- **Cumplimiento normativo**: Solo reportar vulnerabilidades que apliquen a tu estándar (OWASP, CWE Top 25, PCI-DSS, etc.)
- **Reducción de ruido**: Menos alertas = más foco en lo que importa
- **Auditorías**: Demostrar que tu pipeline cubre exactamente las categorías requeridas
- **Priorización**: Alinear los findings con el framework de tu organización

## 📁 Estructura del proyecto

```
.github/
├── codeql/
│   ├── codeql-config.yml          ← Configuración de CodeQL (OWASP + custom)
│   ├── owasp-top-10-js.qls       ← Query suite: solo queries OWASP Top 10 (2025)
│   └── custom-queries/            ← 🏦 Query pack personalizado
│       ├── qlpack.yml             ← Dependencias del pack
│       └── missing-context-validation.ql  ← Regla: validar antes de operar
└── workflows/
    └── codeql.yml                 ← Workflow que ejecuta el análisis
src/
├── index.js                       ← Entry point Express
├── services/
│   └── bank-service.js            ← 🏦 Servicio bancario (validación + operaciones)
├── compliant-operation.js         ← 🏦 ✅ Operaciones CON validación (0 alertas)
├── non-compliant-operation.js     ← 🏦 ❌ Operaciones SIN validación (5 alertas)
├── sql-injection.js               ← A05: Injection (SQL)
├── xss.js                         ← A05: Injection (XSS)
├── command-injection.js           ← A05: Injection (Command)
├── prototype-pollution.js         ← A05: Injection (Prototype Pollution)
├── path-traversal.js              ← A01: Broken Access Control
├── open-redirect.js               ← A01: Broken Access Control
├── ssrf.js                        ← A01: Broken Access Control (SSRF)
├── security-misconfiguration.js   ← A02: Security Misconfiguration
├── weak-crypto.js                 ← A04: Cryptographic Failures
├── hardcoded-credentials.js       ← A07: Authentication Failures
├── insecure-deserialization.js    ← A08: Software or Data Integrity
├── config.json                    ← A07: Passwords en archivo de configuración
└── non-owasp-redos.js             ← ⚠️ ReDoS (NO OWASP - prueba de filtro)
```

## 🔑 Archivos clave

### 1. `.github/codeql/owasp-top-10-js.qls` — La Query Suite

Este es el **archivo más importante**. Define exactamente qué queries de CodeQL se ejecutan, filtrando por ID de query y agrupándolas por categoría OWASP:

```yaml
- include:
    id:
    # A01:2021 - Broken Access Control
    - js/path-injection
    - js/server-side-unvalidated-url-redirection

    # A02:2021 - Cryptographic Failures
    - js/weak-cryptographic-algorithm
    - js/insufficient-key-size

    # A03:2021 - Injection
    - js/sql-injection
    - js/reflected-xss
    - js/command-line-injection
    - js/prototype-pollution
    # ... más queries
```

> 📝 **¿Cómo funciona?** CodeQL tiene un ID único para cada query (ej: `js/sql-injection`). Al listar solo los IDs que corresponden a CWEs del OWASP Top 10, garantizamos que **solo se ejecuten esas reglas**.

### 2. `.github/codeql/codeql-config.yml` — La Configuración

Apunta a la query suite personalizada y define qué paths analizar:

```yaml
name: "CodeQL - OWASP Top 10"

# ⚠️ CLAVE: sin esto, las queries por defecto TAMBIÉN se ejecutan
disable-default-queries: true

queries:
  - uses: ./.github/codeql/owasp-top-10-js.qls

paths:
  - src
```

> ⚠️ **Muy importante**: La directiva `disable-default-queries: true` es **imprescindible**. Sin ella, CodeQL ejecuta las queries por defecto (`default` suite) **además** de las personalizadas, y aparecerán alertas fuera de OWASP Top 10.

### 3. `.github/workflows/codeql.yml` — El Workflow

Referencia la configuración personalizada:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: javascript-typescript
    config-file: ./.github/codeql/codeql-config.yml
```

## 🏦 Query Personalizada: Validación de Contexto Bancario

Además de filtrar por marco normativo, este repo demuestra cómo crear **queries CodeQL propias** para verificar reglas de negocio específicas.

### El problema

En entornos bancarios, toda operación sensible (transacciones, pagos, créditos, retiros) **debe estar precedida** por una validación de contexto (sesión, autorización). Si un desarrollador se salta esa validación, introduce un riesgo de seguridad.

### La solución: una query personalizada

El archivo `.github/codeql/custom-queries/missing-context-validation.ql` implementa esta regla:

```
📦 Operaciones sensibles           🔐 Validaciones requeridas
─────────────────────────          ─────────────────────────
executeTransaction()          ←    validateContext()
transferFunds()               ←    validateSession()
processPayment()              ←    verifyAuthorization()
approveCredit()
withdrawFunds()
```

**Si una operación sensible se ejecuta sin que alguna función de validación la preceda en la misma función, CodeQL genera una alerta.**

### Cómo funciona la query

```ql
// 1. Definir qué funciones son "sensibles"
predicate isSensitiveOperationName(string name) {
  name = "executeTransaction" or
  name = "transferFunds" or ...
}

// 2. Definir qué funciones son "validaciones"
predicate isValidationFunctionName(string name) {
  name = "validateContext" or
  name = "validateSession" or ...
}

// 3. Buscar llamadas sensibles SIN validación previa
from CallExpr sensitiveCall, Function enclosingFunc
where
  isSensitiveOperationName(getCallName(sensitiveCall)) and
  enclosingFunc = sensitiveCall.getEnclosingFunction() and
  not exists(CallExpr validationCall |
    isValidationFunctionName(getCallName(validationCall)) and
    validationCall.getEnclosingFunction() = enclosingFunc and
    validationCall.getLocation().getStartLine() < sensitiveCall.getLocation().getStartLine()
  )
select sensitiveCall, "Operación sin validación de contexto..."
```

### Resultado esperado

| Archivo | ¿Alerta? | Motivo |
|---|---|---|
| `src/compliant-operation.js` | ✅ Sin alertas | Todas las operaciones llaman `validateContext()` o `validateSession()` antes |
| `src/non-compliant-operation.js` | ❌ 5 alertas | Las 5 operaciones se ejecutan sin validación previa |

### Cómo crear tu propio query pack

```yaml
# .github/codeql/custom-queries/qlpack.yml
name: custom-banking-queries
version: 0.0.1
dependencies:
  codeql/javascript-all: "*"  # Necesario para importar la librería de JS
```

```yaml
# .github/codeql/codeql-config.yml
disable-default-queries: true
queries:
  - uses: ./.github/codeql/owasp-top-10-js.qls      # Queries estándar filtradas
  - uses: ./.github/codeql/custom-queries             # Queries personalizadas
```

> 💡 **Clave**: `queries` acepta múltiples entradas. Puedes combinar suites estándar filtradas con queries propias en la misma configuración.

## 📊 Mapeo OWASP Top 10 (2025) → CWE → Queries CodeQL (JS/TS)

| OWASP 2025 | Categoría | CWEs Principales | Queries CodeQL (ejemplos) |
|---|---|---|---|
| **A01** | Broken Access Control | CWE-22, CWE-601, CWE-918 | `js/path-injection`, `js/server-side-unvalidated-url-redirection`, `js/request-forgery` |
| **A02** | Security Misconfiguration | CWE-16, CWE-611 | `js/cors-misconfiguration-for-credentials`, `js/disabling-certificate-validation` |
| **A03** | Software Supply Chain Failures | — | `js/insecure-dependency` (Dependabot es mejor para esto) |
| **A04** | Cryptographic Failures | CWE-327, CWE-328, CWE-330 | `js/weak-cryptographic-algorithm`, `js/insufficient-key-size`, `js/insecure-randomness` |
| **A05** | Injection | CWE-79, CWE-78, CWE-89, CWE-94, CWE-1321 | `js/sql-injection`, `js/reflected-xss`, `js/command-line-injection`, `js/prototype-pollution` |
| **A06** | Insecure Design | CWE-799 | `js/missing-rate-limiting` |
| **A07** | Authentication Failures | CWE-798, CWE-259, CWE-384 | `js/hardcoded-credentials`, `js/jwt-missing-verification`, `js/session-fixation` |
| **A08** | Software or Data Integrity Failures | CWE-502 | `js/unsafe-deserialization`, `js/zipslip` |
| **A09** | Security Logging & Alerting Failures | CWE-778 | `js/stack-trace-exposure` |
| **A10** | Mishandling of Exceptional Conditions | CWE-248, CWE-754 | `js/resource-exhaustion` (cobertura limitada en CodeQL) |

### Cambios principales de 2021 → 2025

| Cambio | Detalle |
|---|---|
| 🔄 **SSRF → A01** | SSRF ya no es categoría independiente, se absorbe en Broken Access Control |
| ⬆️ **Security Misconfiguration → A02** | Sube de #5 a #2 por mayor prevalencia |
| 🆕 **A03 Supply Chain Failures** | Expande "Vulnerable Components" a toda la cadena de suministro |
| 🆕 **A10 Exceptional Conditions** | Nueva categoría: manejo inadecuado de errores y condiciones excepcionales |

## 🔄 ¿Cómo adaptar esto a otros marcos normativos?

El mismo patrón aplica para cualquier framework. Solo necesitas:

1. **Identificar los CWEs** que cubre tu marco normativo
2. **Buscar las queries de CodeQL** que mapean a esos CWEs en la [documentación oficial de cobertura CWE](https://codeql.github.com/codeql-query-help/full-cwe/)
3. **Crear una nueva `.qls`** con esos IDs

### Ejemplos de otros marcos:

| Marco Normativo | Qué hacer |
|---|---|
| **CWE Top 25** | Crear `cwe-top-25.qls` con queries de los 25 CWEs más peligrosos |
| **SANS Top 25** | Similar a CWE Top 25 (comparten muchos CWEs) |
| **PCI-DSS** | Filtrar por CWEs relevantes a requisitos 6.5.x de PCI-DSS |
| **NIST 800-53** | Mapear controles de seguridad a CWEs correspondientes |

## 🛠️ Query Suites predefinidas vs personalizadas

| Suite | Qué incluye | Cuándo usar |
|---|---|---|
| `default` | Queries de alta precisión y severidad | Uso general, pocos falsos positivos |
| `security-extended` | `default` + queries adicionales de seguridad | Análisis de seguridad amplio |
| `security-and-quality` | Todo lo anterior + calidad de código | Análisis completo |
| **Suite personalizada (.qls)** | **Solo lo que tú definas** | **Cumplimiento normativo específico** ✅ |

## 🧪 Verificación: ¿Los filtros funcionan?

### Filtro OWASP

El archivo `src/non-owasp-redos.js` contiene una vulnerabilidad **ReDoS** (Regular Expression Denial of Service, CWE-1333) que **no pertenece al OWASP Top 10**. 

- ✅ Con la suite `security-extended` estándar, CodeQL **sí la detectaría** (`js/polynomial-redos`)
- ❌ Con nuestra suite personalizada OWASP, **no aparece** en la pestaña Security

### Query personalizada bancaria

- ✅ `src/compliant-operation.js` → **0 alertas** (valida antes de operar)
- ❌ `src/non-compliant-operation.js` → **5 alertas** (opera sin validar)

Esto demuestra que ambos filtros funcionan: las queries estándar se filtran por OWASP, y las queries personalizadas detectan patrones de negocio específicos.

## 📚 Referencias

- [CodeQL Query Suites - Documentación oficial](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-query-suites)
- [Cobertura CWE de CodeQL](https://codeql.github.com/codeql-query-help/codeql-cwe-coverage/)
- [Lista completa de CWEs cubiertos](https://codeql.github.com/codeql-query-help/full-cwe/)
- [Crear query suites personalizadas](https://codeql.github.com/docs/codeql-cli/creating-codeql-query-suites/)
- [securingdev/codeql-query-suites](https://github.com/securingdev/codeql-query-suites) — Ejemplo de suites por framework
- [OWASP Top 10 (2025)](https://owasp.org/Top10/2025/0x00_2025-Introduction)

## 📄 Licencia

MIT

## 🌐 Sígueme en Mis Redes Sociales

Si te ha gustado este proyecto y quieres ver más contenido como este, no olvides suscribirte a mi canal de YouTube y seguirme en mis redes sociales:

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Sígueme-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Sígueme-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>
