// Include additional mocks not included in the react-native preset
global.window = {
  Uint8Array,
  Promise
};
function XMLHttpRequest() {}
XMLHttpRequest.prototype.getResponseHeader = function() {};
global.XMLHttpRequest = XMLHttpRequest;

delete global.Buffer;

jest.mock('b64-lite', () => require('b64-lite/dist/react-native.js'));
jest.mock('str2buf', () => require('str2buf/dist/str2buf.js'));

const crypto = require('../src/react-native');

require('webcrypto-test-suite')({
  crypto,
  shouldSkip(spec) {
    if (spec.includes('RS256') && spec.includes('generateKey')) return true;
    if (spec.includes('RS384') && spec.includes('generateKey')) return true;
    if (spec.includes('RS512') && spec.includes('generateKey')) return true;
    if (spec.includes('PS256') && spec.includes('generateKey')) return true;
    if (spec.includes('PS384') && spec.includes('generateKey')) return true;
    if (spec.includes('PS512') && spec.includes('generateKey')) return true;

    // FIXME: https://github.com/facebook/jest/issues/8475
    if (spec.includes('sign')) return true;
    if (spec.includes('PBKDF2')) {
        if (spec.includes('deriveBits')) return true;
        if (spec.includes('deriveKey')) return true;
    }
  }
});
