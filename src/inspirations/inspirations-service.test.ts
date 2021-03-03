import * as inspirationsService from './inspirations-service';
import { db, tables } from '../infrastructure/db';
import { Inspiration } from './inspiration';
import { NotFoundError } from '../errors';
import { cleanDb } from '../test-utils/clean-db';
import { isToday } from 'date-fns';

describe('inspirations-service', () => {
  beforeEach(cleanDb);

  afterAll(cleanDb);

  describe('createInspiration', () => {
    test('Should create an Inspiration', async () => {
      // Arrange
      const text = 'Go to a concert with some friends';

      // Act
      const result = await inspirationsService.createInspiration(text);

      // Assert
      const expectedResult = await db<Inspiration>(tables.inspirations)
        .where('id', result.id)
        .first();

      expect(result).toStrictEqual(expectedResult);
      expect(isToday(result.createdAt)).toBe(true);
      expect(result.createdAt).toEqual(result.updatedAt);
    });
  });

  describe('listInspirations', () => {
    const setup = async (): Promise<Inspiration[]> => {
      const texts = [
        'Volunteer and help out at a senior center',
        'Watch a classic movie',
      ];

      return await Promise.all(
        texts.map(
          async (text) => await inspirationsService.createInspiration(text)
        )
      );
    };

    test('Should return all Inspirations', async () => {
      // Arrange
      const expectedEntries = await setup();

      // Act
      const result = await inspirationsService.listInspirations();

      // Assert
      expect(result).toEqual(expect.arrayContaining(expectedEntries));
    });
  });

  describe('deleteInspiration', () => {
    const setup = async (): Promise<Inspiration> => {
      return await inspirationsService.createInspiration(
        'Learn how to use an Arduino'
      );
    };

    test('Given an existing id then it should delete the Inspiration', async () => {
      // Arrange
      const inspiration = await setup();

      // Act
      await inspirationsService.deleteInspiration(inspiration.id);

      // Assert
      await expect(
        db<Inspiration>(tables.inspirations)
          .select('id')
          .where('id', inspiration.id)
      ).resolves.toStrictEqual([]);
    });

    test('Given a non-existing id then it should throw NotFoundError', async () => {
      // Act and Assert
      await expect(
        inspirationsService.deleteInspiration('non-existing-id')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
