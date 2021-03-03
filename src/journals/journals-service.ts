import { db, tables } from '../infrastructure/db';
import { Journal } from './journal';
import { JournalEntry } from './journal-entry';
import { NotFoundError } from '../errors';
import { QueryOptions } from '../query';
import { usersService } from '../users';

export const createJournal = async (
  userId: string,
  title: string
): Promise<Journal> => {
  let user = await usersService.getUser(userId);

  if (!user) {
    user = await usersService.createUser(userId);
  }

  const result = await db<Journal>(tables.journals)
    .insert({ userId, title })
    .returning('*');

  return result[0];
};

const getJournal = async (userId: string): Promise<Journal | null> => {
  const user = await usersService.getUser(userId);

  if (!user) {
    throw new NotFoundError(`User ${userId} not found`);
  }

  const journal = await db<Journal>(tables.journals)
    .where('userId', userId)
    .first();

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
  userId: string,
  title: string,
  text: string
): Promise<JournalEntry> => {
  const journal = await getJournal(userId);

  if (!journal) {
    throw new NotFoundError(`Journal not found for user ${userId}`);
  }

  const now = new Date();

  const todayEntry = await db<JournalEntry>(tables.entries)
    .select('id')
    .where('journalId', journal.id)
    .andWhereRaw('created_at::date = ?::date', [now])
    .first();

  const entry: Partial<JournalEntry> = {
    id: todayEntry?.id,
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
  userId: string,
  entryId: string,
  data: Partial<
    Omit<JournalEntry, 'id' | 'journalId' | 'createdAt' | 'updatedAt'>
  >
): Promise<JournalEntry> => {
  const journal = await getJournal(userId);

  if (!journal) {
    throw new NotFoundError(`Journal not found for user ${userId}`);
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
    .returning('*');

  return result[0];
};

export const listEntries = async (
  userId: string,
  queryMethods?: QueryOptions<Omit<JournalEntry, 'journalId'>>
): Promise<JournalEntry[]> => {
  const journal = await getJournal(userId);

  if (!journal) {
    throw new NotFoundError(`Journal not found for user ${userId}`);
  }

  return await db<JournalEntry>(tables.entries)
    .where({ journalId: journal.id })
    .where(queryMethods?.where ? queryMethods.where : {})
    .orderBy(queryMethods?.orderBy ? queryMethods.orderBy : []);
};
