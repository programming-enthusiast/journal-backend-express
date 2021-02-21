import { isToday, isAfter, endOfYesterday } from 'date-fns';
import { orderBy, zip } from 'lodash';
import { Order } from '../common/order';
import { NotFoundError } from '../errors';
import db, { tables } from '../infrastructure/db';
import { Journal } from './journal';
import { JournalEntry } from './journal-entry';
import * as journalsService from './journals-service';

describe('journals-service', () => {
  beforeAll(async () => {
    await db.migrate.rollback();
  });

  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  describe('createJournal', () => {
    test('Should create a Journal', async () => {
      // Act
      const journal = await journalsService.createJournal();

      // Assert
      const dbJournal = await db<Journal>(tables.journals)
        .where('id', journal.id)
        .first();

      expect(journal).toStrictEqual(dbJournal);
      expect(isToday(journal.createdAt)).toBe(true);
      expect(journal.createdAt).toEqual(journal.updatedAt);
    });
  });

  describe('createOrUpdateEntry', () => {
    const setup = async (): Promise<{
      journal: Journal;
      title: string;
      text: string;
    }> => {
      const journal = await journalsService.createJournal();
      const title = 'title';
      const text = 'text';

      return { journal, title, text };
    };

    test('Given an existing Journal id and a no entry was created in the today then should create a new Entry', async () => {
      // Arrange
      const { journal, title, text } = await setup();

      // Act
      const entry = await journalsService.createOrUpdateEntry(
        journal.id,
        title,
        text
      );

      // Assert
      const dbEntry = await db<JournalEntry>(tables.entries)
        .where('id', entry.id)
        .first();

      expect(entry).toStrictEqual(dbEntry);
      expect(entry.journalId).toBe(journal.id);
      expect(entry.title).toBe(title);
      expect(entry.text).toBe(text);
      expect(isToday(journal.createdAt)).toBe(true);
      expect(journal.createdAt).toEqual(journal.updatedAt);
    });

    test('Given an Entry was already created in the today then should update the Entry', async () => {
      // Arrange
      const { journal, title, text } = await setup();

      const entry = await journalsService.createOrUpdateEntry(
        journal.id,
        title,
        text
      );

      const newTitle = 'new title';

      const newText = 'new text';

      // Act
      const updatedEntry = await journalsService.createOrUpdateEntry(
        journal.id,
        newTitle,
        newText
      );

      // Assert
      expect(updatedEntry.id).toBe(entry.id);
      expect(updatedEntry.journalId).toBe(entry.journalId);
      expect(updatedEntry.title).toBe(newTitle);
      expect(updatedEntry.text).toBe(newText);
      expect(updatedEntry.createdAt).toEqual(entry.createdAt);
      expect(isAfter(updatedEntry.updatedAt, updatedEntry.createdAt)).toBe(
        true
      );
    });

    test('Given there exists an Entry from a previous day and no Entry for today then should create a new Entry', async () => {
      // Arrange
      const { journal, title, text } = await setup();

      const yesterday = endOfYesterday();

      const yesterdayInsertResult = await db<JournalEntry>(tables.entries)
        .insert({
          journalId: journal.id,
          title: 'yesterday title',
          text: 'yesterday text',
          createdAt: yesterday,
          updatedAt: yesterday,
        })
        .returning('*');

      const yesterdayEntry = yesterdayInsertResult[0];

      // Act
      const entry = await journalsService.createOrUpdateEntry(
        journal.id,
        title,
        text
      );

      // Assert
      const entries = await db<JournalEntry>(tables.entries);

      expect(entries.length).toBe(2);
      expect(entry.journalId).toBe(yesterdayEntry.journalId);
      expect(isAfter(entry.createdAt, yesterdayEntry.createdAt)).toBe(true);
      expect(isAfter(entry.updatedAt, yesterdayEntry.updatedAt)).toBe(true);
    });

    test('Given an non-existing Journal id then should throw', async () => {
      const nonExistingJournalId = 'nonExistingJournalId';

      await expect(
        journalsService.createOrUpdateEntry(
          nonExistingJournalId,
          'title',
          'text'
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateEntry', () => {
    const setup = async (): Promise<{
      entry: JournalEntry;
      update: Partial<
        Omit<JournalEntry, 'journalId' | 'id' | 'createdAt' | 'updatedAt'>
      >;
    }> => {
      const journal = await journalsService.createJournal();

      const title = 'title';
      const text = 'text';

      const entry = await journalsService.createOrUpdateEntry(
        journal.id,
        title,
        text
      );

      const update = {
        title: 'new title',
        text: 'new text',
      };

      return { entry, update };
    };

    test('Should update an existing Entry', async () => {
      // Arrange
      const { entry, update } = await setup();

      // Act
      const updatedEntry = await journalsService.updateEntry(
        entry.journalId,
        entry.id,
        update
      );

      // Assert
      expect(updatedEntry.id).toBe(entry.id);
      expect(updatedEntry.journalId).toBe(entry.journalId);
      expect(updatedEntry.title).toBe(update.title);
      expect(updatedEntry.text).toBe(update.text);
      expect(updatedEntry.createdAt).toEqual(entry.createdAt);
      expect(isAfter(updatedEntry.updatedAt, updatedEntry.createdAt)).toBe(
        true
      );
    });

    test('Given empty update then should return existing Entry', async () => {
      // Arrange
      const { entry } = await setup();

      // Act
      const updatedEntry = await journalsService.updateEntry(
        entry.journalId,
        entry.id,
        {}
      );

      // Assert
      expect(updatedEntry).toStrictEqual(entry);
    });

    test('Given a non-existing Journal id then should throw', async () => {
      // Arrange
      const { entry, update } = await setup();

      const nonExistingJournalId = 'nonExistingJournalId';

      // Act and Assert
      await expect(
        journalsService.updateEntry(nonExistingJournalId, entry.id, update)
      ).rejects.toThrow(new NotFoundError('Journal not found'));
    });

    test('Given a non-existing Entry id then should throw', async () => {
      // Arrange
      const { entry, update } = await setup();

      const nonExistingEntryId = 'nonExistingEntryId';

      // Act and Assert
      await expect(
        journalsService.updateEntry(entry.journalId, nonExistingEntryId, update)
      ).rejects.toThrow(new NotFoundError('Journal Entry not found'));
    });
  });

  describe('listEntries', () => {
    const setup = async (): Promise<{
      journalOneEntries: JournalEntry[];
      journalTwoEntries: JournalEntry[];
    }> => {
      const journalOneEntries: JournalEntry[] = [];
      const journalTwoEntries: JournalEntry[] = [];

      const entriesDataOne: Partial<
        Omit<JournalEntry, 'journalId' | 'id' | 'createdAt' | 'updatedAt'>
      >[] = [
        {
          title: 'title',
          text: 'text',
        },
      ];

      const entriesDataTwo: Partial<
        Omit<JournalEntry, 'journalId' | 'id' | 'createdAt' | 'updatedAt'>
      >[] = [
        {
          title: 'another title',
          text: 'another text',
        },
      ];

      const journalOne = await journalsService.createJournal();

      const journalTwo = await journalsService.createJournal();

      for (const datum of entriesDataOne) {
        journalOneEntries.push(
          await journalsService.createOrUpdateEntry(
            journalOne.id,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            datum.title!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            datum.text!
          )
        );
      }

      for (const datum of entriesDataTwo) {
        journalTwoEntries.push(
          await journalsService.createOrUpdateEntry(
            journalTwo.id,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            datum.title!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            datum.text!
          )
        );
      }

      return { journalOneEntries, journalTwoEntries };
    };

    test('Given no queryMethods then should return all entries', async () => {
      // Arrange
      const { journalOneEntries, journalTwoEntries } = await setup();

      // Act
      const entries = await journalsService.listEntries();

      // Assert
      expect(entries).toEqual(
        expect.arrayContaining([...journalOneEntries, ...journalTwoEntries])
      );
    });

    test('Given queryMethods where then should return the corresponsing entries', async () => {
      // Arrange
      const { journalOneEntries } = await setup();

      // Act
      const entries = await journalsService.listEntries({
        where: {
          journalId: journalOneEntries[0].journalId,
        },
      });

      // Assert
      expect(entries).toEqual(expect.arrayContaining(journalOneEntries));
    });

    test('Given queryMethods where then should return the corresponsing entries', async () => {
      // Arrange
      const { journalOneEntries } = await setup();

      // Act
      const entries = await journalsService.listEntries({
        where: {
          journalId: journalOneEntries[0].journalId,
        },
      });

      // Assert
      expect(entries).toEqual(expect.arrayContaining(journalOneEntries));
    });

    test.each(['asc' as Order, 'desc' as Order])(
      'Given queryMethods orderBy then should return the corresponsing entries ordered by %p',
      async (order: Order) => {
        // Arrange
        const { journalOneEntries, journalTwoEntries } = await setup();

        const expectedSortedArray = orderBy(
          [...journalOneEntries, ...journalTwoEntries],
          ['createdAt'],
          [order]
        );

        // Act
        const entries = await journalsService.listEntries({
          orderBy: [{ column: 'createdAt', order }],
        });

        // Assert
        for (const pair of zip(entries, expectedSortedArray)) {
          expect(pair[0]).toStrictEqual(pair[1]);
        }
      }
    );
  });
});
