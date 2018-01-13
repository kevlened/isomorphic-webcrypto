# isomorphic-webcrypto [![NPM](https://img.shields.io/npm/v/isomorphic-webcrypto.svg)](https://npmjs.com/package/isomorphic-webcrypto)
isomorphic webcrypto library for IE11+ in 3kB

## What?

There's a great Node polyfill for the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), but [it's not isomorphic yet](https://github.com/anvilresearch/webcrypto/issues/57). This fills the gap until it is.

IE11 and versions of Safari < 11 use an older version of the spec, so the browser implementation includes a [webcrypto-shim](https://github.com/vibornoff/webcrypto-shim) to iron out the differences. You'll still need to provide your own Promise polyfill.

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

See [webcrypto-shim's supported browsers](https://github.com/vibornoff/webcrypto-shim#supported-browsers) for standard browser support.

If you need a js-only implementation for older browsers or environments that don't have any crypto support, the [Microsoft Research library](https://www.microsoft.com/en-us/download/details.aspx?id=52439) is exposed as the `extended` version.

```javascript
const crypto = require('isomorphic-crypto/extended')

/**
 * IMPORTANT: On platforms without crypto, the
 * js-only implementation needs another source 
 * of entropy for operations that require
 * random numbers (creating keys, encrypting,
 * wrapping keys) This should NOT be Math.random()
 */

crypto.initPrng(randomArrayOf48Bytes)
```

> 

## I just want to drop in a script tag

You should use the webcrypto-shim library directly:

```html
<!-- Any Promise polyfill will do -->
<script src="https://unpkg.com/bluebird"></script>
<script src="https://unpkg.com/webcrypto-shim"></script>
```

## License

MIT