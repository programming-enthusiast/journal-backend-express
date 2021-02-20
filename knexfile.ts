import dotenv from 'dotenv'

dotenv.config()

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/infrastructure/db/migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/infrastructure/db/migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/infrastructure/db/migrations',
    },
  },
}
