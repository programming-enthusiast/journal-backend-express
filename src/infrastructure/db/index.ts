import knex from 'knex'
import config from '../../config'

const db = knex(config.pg)

export default db
