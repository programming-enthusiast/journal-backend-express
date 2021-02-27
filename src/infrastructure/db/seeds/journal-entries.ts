import db, { tables } from '..';
import { Journal } from '../../../journals/journal';
import { JournalEntry } from '../../../journals/journal-entry';
import inspirationTexts from './inspiration-texts.json';
import logger from '../../../logger';
import { lorem } from 'faker';
import { sample } from 'lodash';

export const seed = async (): Promise<void> => {
  try {
    for (let i = 0; i <= 3; i++) {
      const journalInsertResult = await db<Journal>(tables.journals)
        .insert({
          id: i.toString(),
        })
        .returning('*');

      if (journalInsertResult.length === 0) {
        throw new Error('journalInsertResult is empty');
      }

      const journal = journalInsertResult[0];

      for (let j = 0; j <= i; j++) {
        await db<JournalEntry>(tables.entries).insert({
          id: `entry-${j}-from-journal-${journal.id}`,
          journalId: journal.id,
          title: sample(inspirationTexts),
          text: lorem.paragraphs(),
        });
      }
    }
  } catch (err) {
    logger.error(err);
  }
};
