import * as journalsService from './journals-service';
import * as usersService from '../users/users-service';
import db, { tables } from '../infrastructure/db';
import { endOfYesterday, isAfter, isToday, subDays } from 'date-fns';
import { omit, orderBy, zip } from 'lodash';
import { Journal } from './journal';
import { JournalEntry } from './journal-entry';
import { NotFoundError } from '../errors';
import { Ordering } from '../enums/ordering';
import { cleanDb } from '../test-utils/clean-db';

describe('journals-service', () => {
  beforeEach(cleanDb);

  afterAll(cleanDb);

  describe('createJournal', () => {
    const verifyJournal = (
      userId: string,
      title: string,
      actual: Journal,
      expected: Journal
    ) => {
      expect(actual).toStrictEqual({
        ...expected,
        userId,
        title,
      });
      expect(isToday(actual.createdAt)).toBe(true);
      expect(actual.createdAt).toEqual(expected.updatedAt);
    };

    test('Given an existing User then should create a Journal', async () => {
      // Arrange
      const user = await usersService.createUser('existing user');

      const title = 'my journal';

      // Act
      const result = await journalsService.createJournal(user.id, title);

      // Assert
      const expectedResult = await db<Journal>(tables.journals)
        .where('id', result.id)
        .first();

      verifyJournal(user.id, title, result, expectedResult as Journal);
    });

    test('Given a non-existing User then should create an User and a Journal', async () => {
      // Arrange
      const userId = 'new user';

      const title = 'my journal';

      // Act
      const result = await journalsService.createJournal(userId, title);

      // Act and Assert
      const expectedResult = await db<Journal>(tables.journals)
        .where('id', result.id)
        .first();

      verifyJournal(userId, title, result, expectedResult as Journal);
    });
  });

  describe('createOrUpdateEntry', () => {
    const setup = async (): Promise<{
      journal: Journal;
      title: string;
      text: string;
    }> => {
      const user = await usersService.createUser('my user');

      const journal = await journalsService.createJournal(
        user.id,
        'my journal'
      );

      const title = 'title';
      const text = 'text';

      return { journal, title, text };
    };

    test('Given an existing Journal id and a no entry was created in the today then should create a new Entry', async () => {
      // Arrange
      const { journal, title, text } = await setup();

      // Act
      const result = await journalsService.createOrUpdateEntry(
        journal.userId,
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
        journal.userId,
        title,
        text
      );

      const newTitle = 'new title';

      const newText = 'new text';

      // Act
      const result = await journalsService.createOrUpdateEntry(
        journal.userId,
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
        journal.userId,
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

    test('Given a non-existing User then should throw NotFoundError', async () => {
      await expect(
        journalsService.createOrUpdateEntry(
          'non existing user',
          'title',
          'text'
        )
      ).rejects.toThrow(NotFoundError);
    });

    test('Given a non-existing Journal then should throw NotFoundError', async () => {
      const user = await usersService.createUser('another user');

      await expect(
        journalsService.createOrUpdateEntry(user.id, 'title', 'text')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateEntry', () => {
    const setup = async (): Promise<{
      journal: Journal;
      entry: JournalEntry;
      update: Partial<
        Omit<JournalEntry, 'journalId' | 'id' | 'createdAt' | 'updatedAt'>
      >;
    }> => {
      const user = await usersService.createUser('my user');

      const journal = await journalsService.createJournal(
        user.id,
        'my journal'
      );

      const title = 'title';
      const text = 'text';

      const entry = await journalsService.createOrUpdateEntry(
        journal.userId,
        title,
        text
      );

      const update = {
        title: 'new title',
        text: 'new text',
      };

      return { journal, entry, update };
    };

    test('Should update an existing Entry', async () => {
      // Arrange
      const { journal, entry, update } = await setup();

      // Act
      const result = await journalsService.updateEntry(
        journal.userId,
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
      const { journal, entry } = await setup();

      // Act
      const result = await journalsService.updateEntry(
        journal.userId,
        entry.id,
        {}
      );

      // Assert
      expect(result).toStrictEqual(entry);
    });

    test('Given a non-existing User then should throw NotFoundError', async () => {
      // Arrange
      const { entry, update } = await setup();

      // Act and Assert
      await expect(
        journalsService.updateEntry('non existing user', entry.id, update)
      ).rejects.toThrow(NotFoundError);
    });

    test('Given a non-existing Journal then should throw NotFoundError', async () => {
      // Arrange
      const { entry, update } = await setup();

      const user = await usersService.createUser('another user');

      // Act and Assert
      await expect(
        journalsService.updateEntry(user.id, entry.id, update)
      ).rejects.toThrow(NotFoundError);
    });

    test('Given a non-existing Entry then should throw NotFoundError', async () => {
      // Arrange
      const { journal, update } = await setup();

      const nonExistingEntryId = 'nonExistingEntryId';

      // Act and Assert
      await expect(
        journalsService.updateEntry(journal.userId, nonExistingEntryId, update)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('listEntries', () => {
    const setup = async (): Promise<{
      journal: Journal;
      entries: JournalEntry[];
    }> => {
      const user = await usersService.createUser('my user');

      const journal = await journalsService.createJournal(
        user.id,
        'my journal'
      );

      const entries: JournalEntry[] = [];

      const entriesData: Partial<Omit<JournalEntry, 'journalId' | 'id'>>[] = [
        {
          title: 'title',
          text: 'text',
          createdAt: subDays(new Date(), 2),
          updatedAt: subDays(new Date(), 2),
        },
        {
          title: 'another title',
          text: 'another text',
          createdAt: subDays(new Date(), 1),
          updatedAt: subDays(new Date(), 1),
        },
        {
          title: 'yet another title',
          text: 'yet another text',
        },
      ];

      for (const datum of entriesData) {
        const result = await db<JournalEntry>(tables.entries)
          .insert({
            journalId: journal.id,
            title: datum.title,
            text: datum.text,
            createdAt: datum.createdAt,
            updatedAt: datum.updatedAt,
          })
          .returning('*');

        entries.push(result[0]);
      }

      return { journal, entries };
    };

    test('Given no queryMethods then should return all entries from a Journal', async () => {
      // Arrange
      const { journal, entries } = await setup();

      // Act
      const result = await journalsService.listEntries(journal.userId);

      // Assert
      expect(result).toStrictEqual(entries);
    });

    test("Given 'where' query option then should return the corresponsing entries", async () => {
      // Arrange
      const { journal, entries } = await setup();

      const title = 'yet another title';

      const expectedResult = entries.filter((entry) => entry.title === title);

      // Act
      const result = await journalsService.listEntries(journal.userId, {
        where: {
          title,
        },
      });

      // Assert
      expect(result).toStrictEqual(expectedResult);
    });

    test.each(['asc' as Ordering, 'desc' as Ordering])(
      'Given queryMethods orderBy then should return the corresponsing entries ordered by %p',
      async (order: Ordering) => {
        // Arrange
        const { journal, entries } = await setup();

        const expectedResult = orderBy(entries, ['createdAt'], [order]);

        // Act
        const result = await journalsService.listEntries(journal.userId, {
          orderBy: [{ column: 'createdAt', order }],
        });

        // Assert
        for (const pair of zip(result, expectedResult)) {
          expect(pair[0]).toStrictEqual(pair[1]);
        }
      }
    );

    test('Given a non-existing User then should throw NotFoundError', async () => {
      // Act and Assert
      await expect(
        journalsService.listEntries('non existing user')
      ).rejects.toThrow(NotFoundError);
    });

    test('Given a non-existing Journal then should throw NotFoundError', async () => {
      // Arrange
      const user = await usersService.createUser('my user');

      // Act and Assert
      await expect(journalsService.listEntries(user.id)).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
