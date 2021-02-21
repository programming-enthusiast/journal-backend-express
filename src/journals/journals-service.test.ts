import { NotFoundError } from '../errors'
import db from '../infrastructure/db'
import { Journal } from './journal'
import * as journalsService from './journals-service'

describe('journals-service', () => {
  beforeAll(async () => {
    await db.migrate.rollback()
  })

  beforeEach(async () => {
    await db.migrate.latest()
  })

  afterEach(async () => {
    await db.migrate.rollback()
  })

  describe('createJournal', () => {
    test('Should create a Journal', async () => {
      // Act
      const result = await journalsService.createJournal()

      // Assert
      const journal = await journalsService.getJournal(result.id)

      expect(result).toStrictEqual(journal)
    })
  })

  describe('getJournal', () => {
    const journal: Journal = {
      id: 'id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    beforeEach(async () => {
      await db<Journal>('journals').insert(journal)
    })

    test('Given an existing id then it should return a Journal', async () => {
      // Act
      const result = await journalsService.getJournal(journal.id)

      // Assert
      expect(result).toStrictEqual(journal)
    })

    test('Given a non-existing id then it should throw', async () => {
      // Assert
      await expect(
        journalsService.getJournal('non-existing-id')
      ).rejects.toThrow(NotFoundError)
    })
  })
})
