const { hash } = require('./password-hashing')

if (process.argv.length !== 3) {
  console.error('Usage: node hashme.js [CLEAR TEXT YOU WANT TO HASH]')
}
else {
  console.log(hash(process.argv[2]))
}
