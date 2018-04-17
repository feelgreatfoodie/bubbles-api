const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

router.post('/', (req, res, next) => {
  const { username, password } = req.body
  knex('users')
    .where('username', username)
    .then(result => {
      if (result.length !== 1) {
        res.status(400).send('Bad username')
      }
      else if (bcrypt.compareSync(password, result[0].password)) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send(token)
      }
      else {
        res.status(400).send('Bad password')
      }
    })
})

module.exports = router
