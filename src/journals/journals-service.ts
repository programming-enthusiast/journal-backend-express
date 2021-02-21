import { nanoid } from 'nanoid'
import { Journal } from './journal'
import db, { tables } from '../infrastructure/db'
import { NotFoundError } from '../errors'
import { JournalEntry } from './journal-entry'
import { QueryMethods } from '../common/order/query-methods'

export const createJournal = async (): Promise<Journal> => {
  const now = new Date()

  const journal: Journal = {
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  }

  await db<Journal>(tables.journals).insert(journal)

  return journal
}

export const getJournal = async (id: string): Promise<Journal> => {
  const journal = await db<Journal>(tables.journals).where('id', id).first()

  if (!journal) {
    throw new NotFoundError('Journal not found')
  }

  return journal
}

export const upsertEntry = async (
  journalId: string,
  title: string,
  text: string
): Promise<JournalEntry> => {
  const journal = await getJournal(journalId)

  if (!journal) {
    throw new NotFoundError('Journal not found')
  }

  const now = new Date()

  let entry: JournalEntry

  const todayEntry = await db<JournalEntry>(tables.entries)
    .where('journalId', journalId)
    .andWhereRaw('created_at::date = ?::date', [now])
    .first()

  if (!todayEntry) {
    entry = {
      id: nanoid(),
      journalId,
      title,
      text,
      createdAt: now,
      updatedAt: now,
    }

    await db<Journal>(tables.entries).insert(entry)
  } else {
    entry = { ...todayEntry, title, text, updatedAt: now }

    await db<Journal>(tables.entries).where('id', entry.id).update(entry)
  }

  return entry
}

export const listEntries = async (
  queryMethods?: QueryMethods<JournalEntry>
): Promise<JournalEntry[]> => {
  return await db<JournalEntry>(tables.entries)
    .select()
    .where(queryMethods?.where ? queryMethods.where : {})
    .orderBy(queryMethods?.orderBy ? queryMethods.orderBy : [])
}
