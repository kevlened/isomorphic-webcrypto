const generateSecureRandom = require('react-native-securerandom').generateSecureRandom
const EventEmitter = require('mitt')
const b64u = require('b64u-lite')
const str2buf = require('str2buf')
const crypto = require('msrcrypto')
crypto.subtle.forceSync = true

const secureWatch = new EventEmitter()

let secured = !crypto.initPrng
let secureRandomError
if (!secured) {
  generateSecureRandom(48)
  .then(byteArray => {
    crypto.initPrng(Array.from(byteArray))
    secured = true
    secureWatch.emit('secure')
  })
  .catch(err => {
    secureRandomError = err
    secureWatch.emit('secureRandomError')
  })
}

crypto.ensureSecure = function(cb) {
  if (secured) return cb()
  if (secureRandomError) return cb(secureRandomError)
  secureWatch.on('secure', () => cb())
  secureWatch.on('secureRandomError', () => cb(secureRandomError))
}

function standardAlgoName(algo) {
  const upper = algo.toUpperCase();
  return upper === 'RSASSA-PKCS1-V1_5' ? 'RSASSA-PKCS1-v1_5' : upper;
}

// wrap all methods to ensure they're secure
const methods = [
  'decrypt',
  'digest',
  'deriveKey',
  'encrypt',
  'exportKey',
  'generateKey',
  'importKey',
  'sign',
  'unwrapKey',
  'verify',
  'wrapKey'
]
methods.map(key => {
  const original = crypto.subtle[key]
  crypto.subtle[key] = function() {
    const args = Array.from(arguments)
    return new Promise((resolve, reject) => {
      crypto.ensureSecure(err => {
        if (err) return reject(err)
        resolve(original.apply(crypto.subtle, args))
      })
    })
  }
})

const originalGenerateKey = crypto.subtle.generateKey;
crypto.subtle.generateKey = function() {
  const algo = arguments[0];
  if (algo) {
    if (algo.name) algo.name = algo.name.toLowerCase();
    if (algo.hash && algo.hash.name) algo.hash.name = algo.hash.name.toLowerCase();
  }
  return originalGenerateKey.apply(this, arguments)
  .then(res => {
    if (res.publicKey) {
      res.publicKey.usages = ['verify'];
      res.publicKey.algorithm.name = standardAlgoName(res.publicKey.algorithm.name);
      res.privateKey.usages = ['sign'];
      res.privateKey.algorithm.name = standardAlgoName(res.privateKey.algorithm.name);
    } else {
      res.usages = ['sign', 'verify'];
      res.algorithm.name = standardAlgoName(res.algorithm.name);
    }
    return res;
  });
}

const originalImportKey = crypto.subtle.importKey;
crypto.subtle.importKey = function() {
  const importType = arguments[0];
  const key = arguments[1];
  return originalImportKey.apply(this, arguments)
  .then(res => {
    res.algorithm.name = standardAlgoName(res.algorithm.name);
    switch(res.type) {
      case 'secret':
        res.usages = ['sign', 'verify'];
        break;
      case 'private':
        res.usages = ['sign'];
        break;
      case 'public':
        res.usages = ['verify'];
        break;
    }
    if (importType === 'jwk' && key.kty === 'RSA') {
      res.algorithm.modulusLength = b64u.toBinaryString(key.n).length * 8;
      res.algorithm.publicExponent = str2buf.toUint8Array(b64u.toBinaryString(key.e));
    }
    return res;
  });
}

module.exports = crypto
