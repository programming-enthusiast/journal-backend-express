import db, { tables } from '../infrastructure/db';
import { Journal } from './journal';
import { JournalEntry } from './journal-entry';
import { NotFoundError } from '../errors';
import { QueryMethods } from '../common/query-methods';
import { nanoid } from 'nanoid';

export const createJournal = async (): Promise<Journal> => {
  const values: Partial<Journal> = {
    id: nanoid(),
  };

  const result = await db<Journal>(tables.journals)
    .insert(values)
    .returning('*');

  return result[0];
};

const getJournal = async (id: string): Promise<Journal | null> => {
  const journal = await db<Journal>(tables.journals).where('id', id).first();

  if (!journal) {
    return null;
  }

  return journal;
};

/**
 * Creates a new JournalEntry or updates it if there is one already created for the
 * current date.
 */
export const createOrUpdateEntry = async (
  journalId: string,
  title: string,
  text: string
): Promise<JournalEntry> => {
  const journal = await getJournal(journalId);

  if (!journal) {
    throw new NotFoundError(`Journal ${journalId} not found`);
  }

  const now = new Date();

  const todayEntry = await db<JournalEntry>(tables.entries)
    .select('id')
    .where('journalId', journal.id)
    .andWhereRaw('created_at::date = ?::date', [now])
    .first();

  const entry: Partial<JournalEntry> = {
    id: todayEntry?.id || nanoid(),
    journalId: journal.id,
    title,
    text,
  };

  const result = await db<JournalEntry>(tables.entries)
    .insert(entry)
    .onConflict('id')
    .merge()
    .returning('*');

  return result[0];
};

const getEntry = async (id: string): Promise<JournalEntry | null> => {
  const entry = await db<JournalEntry>(tables.entries).where('id', id).first();

  if (!entry) {
    return null;
  }

  return entry;
};

export const updateEntry = async (
  journalId: string,
  entryId: string,
  data: Partial<
    Omit<JournalEntry, 'journalId' | 'id' | 'createdAt' | 'updatedAt'>
  >
): Promise<JournalEntry> => {
  const journal = await getJournal(journalId);

  if (!journal) {
    throw new NotFoundError(`Journal ${journalId} not found`);
  }

  const entry = await getEntry(entryId);

  if (!entry) {
    throw new NotFoundError(`Journal Entry ${entryId} not found`);
  }

  if (Object.keys(data).length === 0) {
    return entry;
  }

  const result = await db<JournalEntry>(tables.entries)
    .update(data)
    .where('id', entryId)
    .andWhere('journalId', journalId)
    .returning('*');

  return result[0];
};

export const listEntries = async (
  queryMethods?: QueryMethods<JournalEntry>
): Promise<JournalEntry[]> => {
  return await db<JournalEntry>(tables.entries)
    .where(queryMethods?.where ? queryMethods.where : {})
    .orderBy(queryMethods?.orderBy ? queryMethods.orderBy : []);
};
