import { nanoid } from 'nanoid'
import { Journal } from './journal'
import db, { tables } from '../infrastructure/db'
import { NotFoundError } from '../errors'
import { JournalEntry } from './journal-entry'

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
    throw new NotFoundError(`Journal id ${id} not found`)
  }

  return journal
}

export const createEntry = async (
  journalId: string,
  title: string,
  text: string
): Promise<JournalEntry> => {
  const now = new Date()

  const entry: JournalEntry = {
    id: nanoid(),
    journalId,
    title,
    text,
    createdAt: now,
    updatedAt: now,
  }

  await db<Journal>(tables.entries).insert(entry)

  return entry
}
