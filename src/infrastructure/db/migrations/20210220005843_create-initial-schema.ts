import * as Knex from 'knex'
import { tables } from '..'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tables.journals, (table) => {
    table.string('id').unique()
    table.timestamps()
  })

  await knex.schema.createTable(tables.inspirations, (table) => {
    table.string('id').unique()
    table.text('text').notNullable()
    table.timestamps()
  })

  await knex.schema.createTable(tables.entries, (table) => {
    table.string('id').unique()
    table.string('journal_id').notNullable()
    table.string('title').notNullable()
    table.string('text').notNullable()
    table.timestamps()

    table.foreign('journal_id').references('id').inTable(tables.journals)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tables.inspirations)
  await knex.schema.dropTable(tables.entries)
  await knex.schema.dropTable(tables.journals)
}
