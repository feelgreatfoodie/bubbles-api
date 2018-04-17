const express = require('express')
const router = express.Router()
const knex = require('../knex')

router.post('/', (req, res, next) => {
  const { username, password } = req.body
  console.log(`>>> ${username} ${password}`)
})

module.exports = router
