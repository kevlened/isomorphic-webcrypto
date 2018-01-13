# isomorphic-webcrypto [![NPM](https://img.shields.io/npm/v/isomorphic-webcrypto.svg)](https://npmjs.com/package/isomorphic-webcrypto)
webcrypto library for Node, React Native and IE11+

## What?

There's a great Node polyfill for the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), but [it's not isomorphic yet](https://github.com/anvilresearch/webcrypto/issues/57). This fills the gap until it is.

IE11 and versions of Safari < 11 use an older version of the spec, so the browser implementation includes a [webcrypto-shim](https://github.com/vibornoff/webcrypto-shim) to iron out the differences. You'll still need to provide your own Promise polyfill.

There's currently no native crypto support in React Native, so [the Microsoft Research library](https://github.com/kevlened/msrCrypto) is exposed.

## Install

`npm install isomorphic-webcrypto`

## Usage

There's a simple example below, but [there are many more here](https://github.com/diafygi/webcrypto-examples).

```javascript
const crypto = require('isomorphic-webcrypto')
// or
import crypto from 'isomorphic-webcrypto'

crypto.subtle.digest(
  { name: 'SHA-256' },
  new Uint8Array([1,2,3]).buffer
)
.then(hash => {
  // do something with the hash buffer
})
```

## Compatibility

* IE11+
* Safari 8+
* Edge 12+
* Chrome 43+
* Opera 24+
* Firefox 34+
* Node 4+
* React Native

### Other Environments

If you need to support other environments (like older browsers), use the [Microsoft Research library](https://github.com/kevlened/msrCrypto).

```javascript
const crypto = require('msrcrypto')

/**
 * IMPORTANT: On platforms without crypto, the
 * js-only implementation needs another source 
 * of entropy for operations that require
 * random numbers (creating keys, encrypting,
 * wrapping keys) This should NOT be Math.random()
 */

crypto.initPrng(randomArrayOf48Bytes)
```

### React Native

React Native support is implemented using [the Microsoft Research library](https://github.com/kevlened/msrCrypto). The React Native environment only supports `Math.random()`, so [react-native-securerandom](https://github.com/rh389/react-native-securerandom) is used to provide proper entropy. This is handled automatically, except for `crypto.getRandomValues()`, which requires you wait:

```javascript
const crypto = require('isomorphic-webcrypto')

crypto.generateKey() // safe (all other methods are safe)
crypto.getRandomValues() // insecure!!!

// Only needed for crypto.getRandomValues
crypto.ensureSecure(err => {
  if (err) throw err
  crypto.getRandomValues() // safe

  // Only wait once, future calls are secure
  // No need to wrap every getRandomValues call
})
```

## I just want to drop in a script tag

You should use [the webcrypto-shim](https://github.com/vibornoff/webcrypto-shim) library directly:

```html
<!-- Any Promise polyfill will do -->
<script src="https://unpkg.com/bluebird"></script>
<script src="https://unpkg.com/webcrypto-shim"></script>
```

## License

MIT