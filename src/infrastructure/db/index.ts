import knex from 'knex'
import knexStringcase from 'knex-stringcase'
import config from '../../config'

export const tables = {
  journals: 'journals',
  inspirations: 'inspirations',
  entries: 'entries',
}

const options = knexStringcase(config.db)

const db = knex(options)

export default db
