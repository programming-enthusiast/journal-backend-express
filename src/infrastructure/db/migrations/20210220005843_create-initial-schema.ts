import * as Knex from 'knex';
import * as functions from '../functions';
import * as triggers from '../triggers';
import { tables } from '..';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(functions.ON_UPDATE_TIMESTAMP_FUNCTION);

  await knex.schema.createTable(tables.journals, (table) => {
    table.string('id').unique();
    table.timestamps(true, true);
  });

  await knex.raw(triggers.onUpdateTrigger(tables.journals));

  await knex.schema.createTable(tables.inspirations, (table) => {
    table.string('id').unique();
    table.text('text').notNullable();
    table.timestamps(true, true);
  });

  await knex.raw(triggers.onUpdateTrigger(tables.inspirations));

  await knex.schema.createTable(tables.entries, (table) => {
    table.string('id').unique();
    table.string('journal_id').notNullable();
    table.string('title').notNullable();
    table.text('text').notNullable();
    table.timestamps(true, true);

    table.foreign('journal_id').references('id').inTable(tables.journals);
    table.index('journal_id');
  });

  await knex.raw(triggers.onUpdateTrigger(tables.entries));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tables.inspirations);
  await knex.schema.dropTable(tables.entries);
  await knex.schema.dropTable(tables.journals);
  await knex.raw(functions.DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
}
