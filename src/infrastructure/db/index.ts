import config from '../../config';
import knex from 'knex';
import knexStringcase from 'knex-stringcase';

export const tables = {
  users: 'users',
  journals: 'journals',
  inspirations: 'inspirations',
  entries: 'entries',
};

const options = knexStringcase(config.db);

const db = knex(options);

export default db;
