import { nanoid } from 'nanoid'
import { Journal } from './journal'
import db, { tables } from '../infrastructure/db'
import { JournalEntry } from './journal-entry'
import { QueryMethods } from '../common/order/query-methods'

export const createJournal = async (): Promise<Journal> => {
  const values: Partial<Journal> = {
    id: nanoid(),
  }

  const result = await db<Journal>(tables.journals)
    .insert(values)
    .returning('*')

  return result[0]
}

export const getJournal = async (id: string): Promise<Journal | null> => {
  const journal = await db<Journal>(tables.journals).where('id', id).first()

  if (!journal) {
    return null
  }

  return journal
}

/**
 * Creates a new JournalEntry or updates it if there is one already created for the
 * current date.
 */
export const createOrUpdateEntry = async (
  journalId: string,
  title: string,
  text: string
): Promise<JournalEntry> => {
  const now = new Date()

  const todayEntry = await db<JournalEntry>(tables.entries)
    .select('id')
    .where('journalId', journalId)
    .andWhereRaw('created_at::date = ?::date', [now])
    .first()

  const entry: Partial<JournalEntry> = {
    id: todayEntry?.id || nanoid(),
    journalId,
    title,
    text,
  }

  const result = await db<JournalEntry>(tables.entries)
    .insert(entry)
    .onConflict('id')
    .merge()
    .returning('*')

  return result[0]
}

export const updateEntry = async (
  journalId: string,
  entryId: string,
  data: Partial<
    Omit<JournalEntry, 'journalId' | 'id' | 'createdAt' | 'updatedAt'>
  >
): Promise<JournalEntry> => {
  const now = new Date()

  const result = await db<JournalEntry>(tables.entries)
    .update({ ...data, updatedAt: now })
    .where('id', entryId)
    .andWhere('journalId', journalId)
    .returning('*')

  return result[0]
}

export const listEntries = async (
  queryMethods?: QueryMethods<JournalEntry>
): Promise<JournalEntry[]> => {
  return await db<JournalEntry>(tables.entries)
    .select()
    .where(queryMethods?.where ? queryMethods.where : {})
    .orderBy(queryMethods?.orderBy ? queryMethods.orderBy : [])
}
