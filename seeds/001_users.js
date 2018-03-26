/* eslint-disable quotes */
exports.seed = (knex, Promise) => (
  knex('users').del()
    .then(() => (
      knex('users').insert([
        {id: 1, name: 'hello@me.com', password: 'thereaintnopassword', is_admin: true}
      ])
    ))
    .then(() => knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"))
)
/* eslint-enable quotes */
