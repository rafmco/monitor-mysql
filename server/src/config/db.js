module.exports = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: 'UTC'
  },
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: 'migrations'
  }
}
