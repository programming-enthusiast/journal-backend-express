import { v4 as uuidv4 } from 'uuid'
import { Journal } from './journal'
import * as journalsRepository from './journals-repository'

export const createJournal = async (): Promise<Journal> => {
  const now = new Date()

  const journal: Journal = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }

  await journalsRepository.save(journal)

  return journal
}
