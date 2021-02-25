import { Inspiration } from './inspiration';

import { nanoid } from 'nanoid';
import db, { tables } from '../infrastructure/db';

export const createInspiration = async (text: string): Promise<Inspiration> => {
  const inspiration: Partial<Inspiration> = {
    id: nanoid(),
    text,
  };

  const result = await db<Inspiration>(tables.inspirations)
    .insert(inspiration)
    .returning('*');

  return result[0];
};

export const listInspirations = async (): Promise<Inspiration[]> => {
  return await db<Inspiration>(tables.inspirations);
};

export const deleteInspiration = async (id: string): Promise<void> => {
  await db<Inspiration>(tables.inspirations).where('id', id).del();
};
