import pg from '../infrastructure/db/pg'
import { Journal } from './journal'

const journals = pg<Journal>('journals')

export const save = async (journal: Journal): Promise<void> => {
  await journals.insert(journal)
}
