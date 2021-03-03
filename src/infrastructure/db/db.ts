import { config } from '../../config';
import knex from 'knex';
import knexStringcase from 'knex-stringcase';

const options = knexStringcase(config.db);

export const db = knex(options);
