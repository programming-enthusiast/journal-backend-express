import { Inspiration } from './inspiration'

import { nanoid } from 'nanoid'
import db, { tables } from '../infrastructure/db'

export const createInspiration = async (text: string): Promise<Inspiration> => {
  const now = new Date()

  const inspiration: Inspiration = {
    id: nanoid(),
    text,
    createdAt: now,
    updatedAt: now,
  }

  await db<Inspiration>(tables.inspirations).insert(inspiration)

  return inspiration
}

export const listInspirations = async (): Promise<Inspiration[]> => {
  return await db<Inspiration>(tables.inspirations).select()
}
