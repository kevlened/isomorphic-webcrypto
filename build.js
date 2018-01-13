const fs = require('fs')
const path = require('path')

let contents = fs.readFileSync(path.join(__dirname, 'node_modules/webcrypto-shim/webcrypto-shim.js'), 'utf8')
contents = contents.replace(
  `self === 'undefined' ? this : self`,
  `self === 'undefined' ? undefined : self`
)
contents += '\n export default {} \n'
fs.writeFileSync(path.join(__dirname, 'src', 'webcrypto-shim.mjs'), contents)
