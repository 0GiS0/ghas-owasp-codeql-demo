// OWASP A04:2025 - Cryptographic Failures (baja de A02:2021)
// CWE-327: Use of Broken/Weak Cryptographic Algorithm
// CWE-328: Reversible One-Way Hash
// CodeQL queries: js/weak-cryptographic-algorithm, js/insufficient-key-size
const crypto = require('crypto');

// VULNERABLE: Using MD5 (broken hash algorithm)
function hashPasswordMD5(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// VULNERABLE: Using SHA-1 (weak hash algorithm)
function hashPasswordSHA1(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
}

// VULNERABLE: Using DES (weak encryption algorithm)
function encryptDES(text, key) {
  const cipher = crypto.createCipheriv('des-ecb', key.slice(0, 8), null);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// VULNERABLE: Insufficient RSA key size
function generateWeakRSAKey() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 1024, // Should be >= 2048
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
}

module.exports = { hashPasswordMD5, hashPasswordSHA1, encryptDES, generateWeakRSAKey };
