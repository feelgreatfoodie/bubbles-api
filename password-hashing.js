const bcryptjs = require('bcryptjs')

const hash = (password, saltRounds = 10) => bcryptjs.hashSync(password, saltRounds)

const
