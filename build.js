const fs = require('fs')
const path = require('path')

let contents = fs.readFileSync(path.join(__dirname, 'node_modules/webcrypto-shim/webcrypto-shim.js'), 'utf8')
contents = contents.replace(
  `self === 'undefined' ? this : self`,
  `self === 'undefined' ? undefined : self`
)
contents += '\n export default {} \n'
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
  ''
);
linerContents = linerContents.replace(/self\./g, 'window.');
linerContents = linerContents.replace('const window$1 = self;', 'const window$1 = window;')
linerContents += '\n module.exports = liner; \n'
fs.writeFileSync(path.join(__dirname, 'src', 'webcrypto-liner.js'), linerContents);
