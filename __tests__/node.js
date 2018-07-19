const crypto = require('../src/index');

require('webcrypto-test-suite')({
  crypto,
  shouldSkip(spec) {
    if (spec.includes('ES256') && spec.includes('verify')) return true;
    if (spec.includes('ES384') && spec.includes('verify')) return true;
    if (spec.includes('ES512')) return true;
  }
});
