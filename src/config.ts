import Joi from 'joi'
import { Config as KnexConfig } from 'knex'

interface Config {
  env: string
  port: number
  pg: KnexConfig
}

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  PGHOST: Joi.string().required(),
  PGPORT: Joi.number().integer().required(),
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
  pg: {
    client: 'pg',
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
  },
}

export default config
