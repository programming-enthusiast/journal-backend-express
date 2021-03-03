import { db, tables } from '../infrastructure/db';
import { Inspiration } from '../inspirations/inspiration';
import { Journal } from '../journals/journal';
import { JournalEntry } from '../journals/journal-entry';
import { User } from '../users/user';

export const cleanDb = async (): Promise<void> => {
  await db<Inspiration>(tables.inspirations).delete();
  await db<JournalEntry>(tables.entries).delete();
  await db<Journal>(tables.journals).delete();
  await db<User>(tables.users).delete();
};
