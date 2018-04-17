const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcryptjs')

router.post('/', (req, res, next) => {
  const { name, password } = req.body
  knex('users')
    .where('name', name)
    .then(result => {
      if (result.length !== 1) {
        res.status(400).send('Bad username')
      }
      else if (bcrypt.compareSync(password, result[0].password)) {
        res.sendStatus(200)
      }
      else {
        res.status(400).send('Bad password')
      }
    })
})

module.exports = router
