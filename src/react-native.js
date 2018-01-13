const generateSecureRandom = require('react-native-securerandom').generateSecureRandom
const EventEmitter = require('mitt')
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

module.exports = crypto
