function includes(haystack, needle) {
  return haystack.indexOf(needle) > -1;
}

window.Promise = require('bluebird');

var ua = navigator.userAgent;
var isSafari = includes(ua, 'Safari') && !includes(ua, 'Chrome');
var isChrome = !isSafari && includes(ua, 'Chrome');
var isEdge = includes(ua, 'Edge');
var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
require('webcrypto-test-suite')({
  crypto: require('../src/browser.js'),
  shouldSkip: function(spec) {
    if (isChrome) {
      if (includes(spec, 'A192GCM')) return true;
      if (includes(spec, 'A192CBC')) return true;
    }
    if (isSafari) {
      if (includes(spec,'ES512')) return true;
      if (includes(spec,'RS384') && includes(spec,'exportKey')) return true;
      if (includes(spec,'RS512') && includes(spec,'exportKey')) return true;
      if (includes(spec,'PS256') && includes(spec,'exportKey')) return true;
      if (includes(spec,'PS384') && includes(spec,'exportKey')) return true;
      if (includes(spec,'PS512') && includes(spec,'exportKey')) return true;
    }
    if (isEdge) {
      // Misidentifies private types as public and has no modulesLength or publicExponent
      if (includes(spec,'RS256') && includes(spec,'importKey')) return true;
      
      // Has no modulesLength or publicExponent
      if (includes(spec,'RS384') && includes(spec,'importKey')) return true;
      if (includes(spec,'RS512') && includes(spec,'importKey')) return true;

      // Should return Uint8Array for publicExponent rather than Int8Array
      if (includes(spec,'RS256') && includes(spec,'generateKey')) return true;
      if (includes(spec,'RS384') && includes(spec,'generateKey')) return true;
      if (includes(spec,'RS512') && includes(spec,'generateKey')) return true;

      // Could not complete the operation due to error c000000d
      if (includes(spec,'RS256') && includes(spec,'sign')) return true;

      // Not working at all
      if (includes(spec,'ES256')) return true;
      if (includes(spec,'ES384')) return true;
      if (includes(spec,'ES512')) return true;
    }
    if (isIE11) {
      // All errors are browser events, so there are no error messages to aid debugging

      // Misidentifies private types as public
      if (includes(spec,'RS256') && includes(spec,'importKey')) return true;
      
      // Missing d, q, dq, p, dp (probably because importKey says it's public)
      if (includes(spec,'RS256') && includes(spec,'exportKey')) return true;
      
      // Not working at all
      if (includes(spec,'RS256') && includes(spec,'sign')) return true;
      if (includes(spec,'RS512') && includes(spec,'sign')) return true;
      if (includes(spec,'RS512') && includes(spec,'verify')) return true;
      if (includes(spec,'HS512')) return true;
      if (includes(spec,'ES256')) return true;
      if (includes(spec,'ES384')) return true;
      if (includes(spec,'ES512')) return true;
    }
  }
});
