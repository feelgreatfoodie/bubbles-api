module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/bubblesapidb'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}
