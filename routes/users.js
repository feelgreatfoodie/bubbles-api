const express = require('express')
const router = express.Router()
const knex = require('../knex')

/* GET users listing. */
router.get('/', (req, res, next) => {
  knex('users')
    .select('name')
    .then((rows) => res.json(rows))
})

module.exports = router
