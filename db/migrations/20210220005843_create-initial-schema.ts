import * as Knex from 'knex';
import * as extensions from '../extensions';
import * as functions from '../functions';
import * as triggers from '../triggers';
import { tables } from '../../src/infrastructure/db';

async function up(knex: Knex): Promise<void> {
  await knex.raw(extensions.CREATE_UUID);

  await knex.raw(functions.ON_UPDATE_TIMESTAMP_FUNCTION);

  await knex.schema.createTable(tables.users, (table) => {
    table.string('id').primary();
    table.timestamps(true, true);
  });

  await knex.raw(triggers.onUpdateTrigger(tables.users));

  await knex.schema.createTable(tables.journals, (table) => {
    table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('user_id').notNullable().unique();
    table.string('title').notNullable();
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable(tables.users);
  });

  await knex.raw(triggers.onUpdateTrigger(tables.journals));

  await knex.schema.createTable(tables.inspirations, (table) => {
    table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('text').notNullable();
    table.timestamps(true, true);
  });

  await knex.raw(triggers.onUpdateTrigger(tables.inspirations));

  await knex.schema.createTable(tables.entries, (table) => {
    table.string('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('journal_id').notNullable();
    table.string('title').notNullable();
    table.text('text').notNullable();
    table.timestamps(true, true);

    table.foreign('journal_id').references('id').inTable(tables.journals);
    table.index('journal_id');
  });

  await knex.raw(triggers.onUpdateTrigger(tables.entries));
}

async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(tables.inspirations);
  await knex.schema.dropTableIfExists(tables.entries);
  await knex.schema.dropTableIfExists(tables.journals);
  await knex.schema.dropTableIfExists(tables.users);
  await knex.raw(functions.DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
  await knex.raw(extensions.DROP_UUID);
}

export { up, down };
