import db, { tables } from '../infrastructure/db';
import { Inspiration } from './inspiration';
import { NotFoundError } from '../errors';

export const createInspiration = async (text: string): Promise<Inspiration> => {
  const inspiration: Partial<Inspiration> = {
    text,
  };

  const result = await db<Inspiration>(tables.inspirations)
    .insert(inspiration)
    .returning('*');

  return result[0];
};

const getInspiration = async (id: string): Promise<Inspiration | null> => {
  const result = await db<Inspiration>(tables.inspirations)
    .where('id', id)
    .first();

  return result ? result : null;
};

export const listInspirations = async (): Promise<Inspiration[]> => {
  return await db<Inspiration>(tables.inspirations);
};

export const deleteInspiration = async (id: string): Promise<void> => {
  const inspiration = await getInspiration(id);

  if (!inspiration) {
    throw new NotFoundError(`Inspiration id ${id} not found`);
  }

  await db<Inspiration>(tables.inspirations).where('id', id).del();
};
