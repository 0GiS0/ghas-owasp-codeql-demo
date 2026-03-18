# 🛡️ GHAS + CodeQL: Configuración por Marco Normativo (OWASP Top 10)

Este repositorio demuestra cómo configurar **GitHub Advanced Security (GHAS)** con **CodeQL** para ejecutar **únicamente** las queries alineadas con un marco normativo específico — en este caso, el **OWASP Top 10 (2021)**.

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
│   ├── codeql-config.yml          ← Configuración de CodeQL (apunta a la suite)
│   └── owasp-top-10-js.qls       ← Query suite: solo queries OWASP Top 10
└── workflows/
    └── codeql.yml                 ← Workflow que ejecuta el análisis
src/
├── index.js                       ← Entry point Express
├── sql-injection.js               ← A03: Injection (SQL)
├── xss.js                         ← A03: Injection (XSS)
├── command-injection.js           ← A03: Injection (Command)
├── prototype-pollution.js         ← A03: Injection (Prototype Pollution)
├── path-traversal.js              ← A01: Broken Access Control
├── open-redirect.js               ← A01: Broken Access Control
├── weak-crypto.js                 ← A02: Cryptographic Failures
├── hardcoded-credentials.js       ← A07: Identification & Auth Failures
├── insecure-deserialization.js    ← A08: Software & Data Integrity
└── ssrf.js                        ← A10: SSRF
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

queries:
  - uses: ./.github/codeql/owasp-top-10-js.qls

paths:
  - src

paths-ignore:
  - node_modules
```

> ⚠️ **Importante**: Al usar `queries:` con una suite personalizada, CodeQL **no** ejecuta las queries predefinidas (`default` ni `security-extended`). Solo ejecuta lo que definas en tu suite.

### 3. `.github/workflows/codeql.yml` — El Workflow

Referencia la configuración personalizada:

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: javascript-typescript
    config-file: ./.github/codeql/codeql-config.yml
```

## 📊 Mapeo OWASP Top 10 → CWE → Queries CodeQL (JS/TS)

| OWASP 2021 | Categoría | CWEs Principales | Queries CodeQL (ejemplos) |
|---|---|---|---|
| **A01** | Broken Access Control | CWE-22, CWE-601 | `js/path-injection`, `js/server-side-unvalidated-url-redirection` |
| **A02** | Cryptographic Failures | CWE-327, CWE-328, CWE-330 | `js/weak-cryptographic-algorithm`, `js/insufficient-key-size`, `js/insecure-randomness` |
| **A03** | Injection | CWE-79, CWE-78, CWE-89, CWE-94, CWE-1321 | `js/sql-injection`, `js/reflected-xss`, `js/command-line-injection`, `js/prototype-pollution` |
| **A04** | Insecure Design | CWE-799 | `js/missing-rate-limiting` |
| **A05** | Security Misconfiguration | CWE-16, CWE-611 | `js/cors-misconfiguration-for-credentials`, `js/disabling-certificate-validation` |
| **A06** | Vulnerable Components | — | `js/insecure-dependency` (Dependabot es mejor para esto) |
| **A07** | Auth Failures | CWE-798, CWE-259, CWE-384 | `js/hardcoded-credentials`, `js/jwt-missing-verification`, `js/session-fixation` |
| **A08** | Data Integrity Failures | CWE-502 | `js/unsafe-deserialization`, `js/zipslip` |
| **A09** | Logging Failures | CWE-778 | `js/stack-trace-exposure` |
| **A10** | SSRF | CWE-918 | `js/request-forgery`, `js/client-side-request-forgery` |

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

## 📚 Referencias

- [CodeQL Query Suites - Documentación oficial](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-query-suites)
- [Cobertura CWE de CodeQL](https://codeql.github.com/codeql-query-help/codeql-cwe-coverage/)
- [Lista completa de CWEs cubiertos](https://codeql.github.com/codeql-query-help/full-cwe/)
- [Crear query suites personalizadas](https://codeql.github.com/docs/codeql-cli/creating-codeql-query-suites/)
- [securingdev/codeql-query-suites](https://github.com/securingdev/codeql-query-suites) — Ejemplo de suites por framework
- [OWASP Top 10 (2021)](https://owasp.org/www-project-top-ten/)

## 📄 Licencia

MIT
