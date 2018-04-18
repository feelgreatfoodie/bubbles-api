const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

router.post('/', (req, res, next) => {
  const { username, password } = req.body

  if (username && password) {
    knex('users')
      .where('username', username)
      .then(result => {
        if (result.length !== 1) {
          res.status(400).send('Bad username')
        }
        else if (bcrypt.compareSync(password, result[0].password)) {
          const payload = {
            username,
            is_admin: result[0].is_admin
          }
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' })
          res.status(200).json({ token })
        }
        else {
          res.status(400).send('Bad password')
        }
      })
  }
  else {
    res.status(400).send('Username and/or password was not sent')
  }
})

module.exports = router
