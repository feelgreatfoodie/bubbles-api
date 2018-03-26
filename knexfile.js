module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/pprmntbbls'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}
