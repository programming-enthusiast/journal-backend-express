import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('journals', (table) => {
    table.string('id').unique()
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('journals')
}
