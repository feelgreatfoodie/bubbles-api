const bcryptjs = require('bcryptjs')

const saltRounds = 10

// compare is defined the way it is to document the argument list.
// Both function are synchronous and just return booleans.

module.exports = {
  hash: (clearText) => bcryptjs.hashSync(clearText, saltRounds),
  compare: (clearText, hash) => bcryptjs.compareSync(clearText, hash)
}
