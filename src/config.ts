import { Joi } from 'celebrate';
import { Config as KnexConfig } from 'knex';

type LogLevel = 'silent' | 'trace' | 'info';

interface Config {
  env: string;
  port: number;
  log: {
    level: LogLevel;
  };
  db: KnexConfig;
  auth0: {
    jwksUri: string;
    audience: string;
    issuer: string;
  };
}

// See https://en.wikipedia.org/wiki/Port_(computer_networking)
const minPort = 0;
const maxPort = Math.pow(2, 16) - 1;

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
  // https://auth0.com/docs/quickstart/backend/nodejs
  AUTH0_JWKS_URI: Joi.string().uri().required(),
  AUTH0_AUDIENCE: Joi.string().required(),
  AUTH0_ISSUER: Joi.string().uri().required(),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config: Config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  log: {
    level: ((): LogLevel => {
      switch (envVars.NODE_ENV) {
        case 'test':
          return 'silent';
        case 'production':
          return 'info';
        default:
          return 'trace';
      }
    })(),
  },
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
  auth0: {
    jwksUri: envVars.AUTH0_JWKS_URI,
    audience: envVars.AUTH0_AUDIENCE,
    issuer: envVars.AUTH0_ISSUER,
  },
};

export default config;
