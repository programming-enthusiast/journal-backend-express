import knex from 'knex'
import config from '../../config'

const pg = knex(config.pg)

export default pg
