import './webcrypto-shim.mjs'
export default (typeof window !== 'undefined') ? window.crypto : self.crypto;
