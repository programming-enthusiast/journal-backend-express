import db, { tables } from '..';
import { Journal } from '../../../journals/journal';
import { JournalEntry } from '../../../journals/journal-entry';
import inspirationTexts from './inspiration-texts.json';
import { lorem } from 'faker';
import { sample } from 'lodash';

export const seed = async (): Promise<void> => {
  for (let i = 0; i <= 3; i++) {
    const journalInsertResult = await db<Journal>(tables.journals)
      .insert({})
      .returning('*');

    const journal = journalInsertResult[0];

    for (let j = 0; j <= i; j++) {
      await db<JournalEntry>(tables.entries).insert({
        journalId: journal.id,
        title: sample(inspirationTexts),
        text: lorem.paragraphs(),
      });
    }
  }
};
