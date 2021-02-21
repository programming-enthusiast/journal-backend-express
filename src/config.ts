import Joi from 'joi'
import { Config as KnexConfig } from 'knex'

interface Config {
  env: string
  port: number
  db: KnexConfig
}

// See https://en.wikipedia.org/wiki/Port_(computer_networking)
const minPort = 0
const maxPort = Math.pow(2, 16) - 1

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().integer().min(minPort).max(maxPort).default(3000),
  PGHOST: Joi.string().required(),
  PGPORT: Joi.number().integer().min(minPort).max(maxPort).required(),
  PGUSER: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGDATABASE: Joi.string().required(),
})
  .unknown()
  .required()

const { error, value: envVars } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config: Config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    client: 'postgresql',
    connection: {
      host: envVars.PGHOST,
      port: envVars.PGPORT,
      user: envVars.PGUSER,
      password: envVars.PGPASSWORD,
      database: envVars.PGDATABASE,
    },
    migrations: {
      directory: `${__dirname}/infrastructure/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/infrastructure/db/seeds`,
    },
  },
}

export default config
