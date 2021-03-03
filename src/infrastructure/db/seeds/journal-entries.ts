import * as journalsService from '../../../journals/journals-service';
import * as usersService from '../../../users/users-service';
import db, { tables } from '..';
import { internet, lorem } from 'faker';
import { JournalEntry } from '../../../journals/journal-entry';
import inspirationTexts from './inspiration-texts.json';
import { sample } from 'lodash';

export const seed = async (): Promise<void> => {
  const userIds = [internet.email(), internet.email(), internet.email()];

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];

    const user = await usersService.createUser(userId);

    const journal = await journalsService.createJournal(
      user.id,
      lorem.sentence()
    );

    for (let j = 0; j <= i; j++) {
      await db<JournalEntry>(tables.entries).insert({
        journalId: journal.id,
        title: sample(inspirationTexts),
        text: lorem.paragraphs(),
      });
    }
  }
};
