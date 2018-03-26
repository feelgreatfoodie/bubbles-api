exports.up = (knex, Promise) => (
  knex.schema.createTable('users', (table) => {
    table.increments()
    table.varchar('name', 256)
    table.varchar('password', 256)
    table.boolean('is_admin')
  })
)

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('users')
