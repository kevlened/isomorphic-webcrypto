const fs = require('fs')
const path = require('path')

const notice = '// section modified by isomorphic-webcrypto build';

let contents = fs.readFileSync(path.join(__dirname, 'node_modules/webcrypto-shim/webcrypto-shim.js'), 'utf8')
contents = contents.replace(
  `self === 'undefined' ? this : self`,
  `self === 'undefined' ? undefined : self`
)
contents += `\n export default {} ${notice} \n`
fs.writeFileSync(path.join(__dirname, 'src', 'webcrypto-shim.mjs'), contents)

let linerContents = fs.readFileSync(path.join(__dirname, 'node_modules/webcrypto-liner/build/webcrypto-liner.shim.js'), 'utf8')
linerContents = linerContents.replace(
  `
  let window;

  if (typeof self === "undefined") {
    const crypto = require("crypto");

    window = {
      crypto: {
        subtle: {},
        getRandomValues: array => {
          const buf = array.buffer;
          const uint8buf = new Uint8Array(buf);
          const rnd = crypto.randomBytes(uint8buf.length);
          rnd.forEach((octet, index) => uint8buf[index] = octet);
          return array;
        }
      }
    };
  } else {
    window = self;
  }`,
  notice
);
linerContents = linerContents.replace(/self\./g, 'window.');
linerContents = linerContents.replace(
  `
  const window$1 = self;

  if (nativeCrypto) {
    Object.freeze(nativeCrypto.getRandomValues);
  }

  try {
    delete window.crypto;
    window$1.crypto = new Crypto$1();
    Object.freeze(window$1.crypto);
  } catch (e) {
    Debug.error(e);
  }

  const crypto = window$1.crypto;

  exports.crypto = crypto;
`, `exports.crypto = new Crypto$1(); ${notice}`);
linerContents += `\n module.exports = liner; ${notice} \n`
fs.writeFileSync(path.join(__dirname, 'src', 'webcrypto-liner.js'), linerContents);
