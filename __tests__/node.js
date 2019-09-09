const crypto = require('../src/index');

require('webcrypto-test-suite')({
  crypto,
  shouldSkip(spec) {
    if (spec.includes('ES256') && spec.includes('exportKey')) return true;
    if (spec.includes('ES384') && spec.includes('exportKey')) return true;
    if (spec.includes('ES512') && spec.includes('exportKey')) return true;
  }
});
