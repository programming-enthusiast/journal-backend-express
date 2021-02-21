import { nanoid } from 'nanoid'
import { Journal } from './journal'
import db from '../infrastructure/db'
import { NotFoundError } from '../errors'

const JOURNALS_TABLE = 'journals'

export const createJournal = async (): Promise<Journal> => {
  const now = new Date()

  const journal: Journal = {
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  }

  await db<Journal>(JOURNALS_TABLE).insert(journal)

  return journal
}

export const getJournal = async (id: string): Promise<Journal> => {
  const journal = await db<Journal>(JOURNALS_TABLE).where('id', id).first()

  if (!journal) {
    throw new NotFoundError(`Journal id ${id} not found`)
  }

  return journal
}
