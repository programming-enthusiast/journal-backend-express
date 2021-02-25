import * as journalsService from './journals-service';
import db, { tables } from '../infrastructure/db';
import { endOfYesterday, isAfter, isToday } from 'date-fns';
import { omit, orderBy, zip } from 'lodash';
import { Journal } from './journal';
import { JournalEntry } from './journal-entry';
import { NotFoundError } from '../errors';
import { Order } from '../common/order';

describe('journals-service', () => {
  const cleanDb = async () => {
    await db<JournalEntry>(tables.entries).delete();
    await db<Journal>(tables.journals).delete();
  };

  beforeEach(cleanDb);

  afterAll(cleanDb);

  describe('createJournal', () => {
    test('Should create a Journal', async () => {
      // Act
      const result = await journalsService.createJournal();

      // Assert
      const expectedResult = await db<Journal>(tables.journals)
        .where('id', result.id)
        .first();

      expect(result).toStrictEqual(expectedResult);
      expect(isToday(result.createdAt)).toBe(true);
      expect(result.createdAt).toEqual(result.updatedAt);
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
      const result = await journalsService.createOrUpdateEntry(
        journal.id,
        title,
        text
      );

      // Assert
      const expectedResult = await db<JournalEntry>(tables.entries)
        .where('id', result.id)
        .first();

      expect(result).toStrictEqual(expectedResult);
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
      const result = await journalsService.createOrUpdateEntry(
        journal.id,
        newTitle,
        newText
      );

      // Assert
      expect(result).toMatchObject(
        omit(
          {
            ...entry,
            title: newTitle,
            text: newText,
            createdAt: entry.createdAt,
          },
          'updatedAt'
        )
      );

      expect(isAfter(result.updatedAt, result.createdAt)).toBe(true);
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
      const result = await journalsService.createOrUpdateEntry(
        journal.id,
        title,
        text
      );

      // Assert
      const entries = await db<JournalEntry>(tables.entries);

      expect(entries.length).toBe(2);
      expect(result.journalId).toBe(yesterdayEntry.journalId);
      expect(isAfter(result.createdAt, yesterdayEntry.createdAt)).toBe(true);
      expect(isAfter(result.updatedAt, yesterdayEntry.updatedAt)).toBe(true);
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
      const result = await journalsService.updateEntry(
        entry.journalId,
        entry.id,
        update
      );

      // Assert
      expect(result).toMatchObject(
        omit(
          {
            ...entry,
            title: update.title,
            text: update.text,
            createdAt: entry.createdAt,
          },
          'updatedAt'
        )
      );

      expect(isAfter(result.updatedAt, result.createdAt)).toBe(true);
    });

    test('Given empty update then should return existing Entry', async () => {
      // Arrange
      const { entry } = await setup();

      // Act
      const result = await journalsService.updateEntry(
        entry.journalId,
        entry.id,
        {}
      );

      // Assert
      expect(result).toStrictEqual(entry);
    });

    test('Given a non-existing Journal id then should throw', async () => {
      // Arrange
      const { entry, update } = await setup();

      const nonExistingJournalId = 'nonExistingJournalId';

      // Act and Assert
      await expect(
        journalsService.updateEntry(nonExistingJournalId, entry.id, update)
      ).rejects.toThrow(NotFoundError);
    });

    test('Given a non-existing Entry id then should throw', async () => {
      // Arrange
      const { entry, update } = await setup();

      const nonExistingEntryId = 'nonExistingEntryId';

      // Act and Assert
      await expect(
        journalsService.updateEntry(entry.journalId, nonExistingEntryId, update)
      ).rejects.toThrow(NotFoundError);
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
      const result = await journalsService.listEntries();

      // Assert
      expect(result).toStrictEqual([
        ...journalOneEntries,
        ...journalTwoEntries,
      ]);
    });

    test('Given queryMethods where then should return the corresponsing entries', async () => {
      // Arrange
      const { journalOneEntries } = await setup();

      // Act
      const result = await journalsService.listEntries({
        where: {
          journalId: journalOneEntries[0].journalId,
        },
      });

      // Assert
      expect(result).toStrictEqual(journalOneEntries);
    });

    test('Given queryMethods where then should return the corresponsing entries', async () => {
      // Arrange
      const { journalOneEntries } = await setup();

      // Act
      const result = await journalsService.listEntries({
        where: {
          journalId: journalOneEntries[0].journalId,
        },
      });

      // Assert
      expect(result).toStrictEqual(journalOneEntries);
    });

    test.each(['asc' as Order, 'desc' as Order])(
      'Given queryMethods orderBy then should return the corresponsing entries ordered by %p',
      async (order: Order) => {
        // Arrange
        const { journalOneEntries, journalTwoEntries } = await setup();

        const expectedResult = orderBy(
          [...journalOneEntries, ...journalTwoEntries],
          ['createdAt'],
          [order]
        );

        // Act
        const result = await journalsService.listEntries({
          orderBy: [{ column: 'createdAt', order }],
        });

        // Assert
        for (const pair of zip(result, expectedResult)) {
          expect(pair[0]).toStrictEqual(pair[1]);
        }
      }
    );
  });
});
