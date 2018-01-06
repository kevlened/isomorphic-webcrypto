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

crypto.subtle.digest(
  { name: 'SHA-256' },
  new Uint8Array([1,2,3]).buffer
)
.then(hash => {
  // do something with the hash buffer
})
```

## Compatibility

See [webcrypto-shim's supported browsers](https://github.com/vibornoff/webcrypto-shim#supported-browsers)

## I just want to drop in a script tag

You should use the webcrypto-shim library directly:

```html
<!-- Any Promise polyfill will do -->
<script src="https://unpkg.com/bluebird"></script>
<script src="https://unpkg.com/webcrypto-shim"></script>
```

## License

MIT