import * as journalsService from './journals-service';
import { ErrorCodes, NotFoundError } from '../errors';
import request, { Response } from 'supertest';
import { Journal } from './journal';
import { JournalEntry } from './journal-entry';
import { ReasonPhrases } from 'http-status-codes';
import app from '../app';

describe('journals-router', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('/api/v1/journals', () => {
    const baseUrl = '/api/v1/journals';

    describe('POST /', () => {
      test('Should create a Journal', () => {
        // Arrange
        const journal: Journal = {
          id: 'id',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        jest
          .spyOn(journalsService, 'createJournal')
          .mockResolvedValueOnce(journal);

        // Act and Assert
        return request(app)
          .post(baseUrl)
          .expect(201)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              ...journal,
              createdAt: journal.createdAt.toISOString(),
              updatedAt: journal.updatedAt.toISOString(),
            });
          })
          .catch((err) => {
            throw err;
          });
      });

      test('Given create journal fails then should return 500', () => {
        // Arrange
        jest
          .spyOn(journalsService, 'createJournal')
          .mockImplementationOnce(() => {
            throw new Error();
          });

        // Act and Assert
        return request(app)
          .post(baseUrl)
          .expect(500)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ErrorCodes.GeneralException,
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
              },
            });
          })
          .catch((err) => {
            throw err;
          });
      });
    });

    describe('POST /:journalId/entries', () => {
      const entry: JournalEntry = {
        id: 'id',
        journalId: 'journalId',
        title: 'title',
        text: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const url = `${baseUrl}/${entry.journalId}/entries`;

      test('Should create a Journal Entry', () => {
        // Arrange
        jest
          .spyOn(journalsService, 'createOrUpdateEntry')
          .mockResolvedValueOnce(entry);

        // Act and Assert
        return request(app)
          .post(url)
          .expect(201)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              ...entry,
              createdAt: entry.createdAt.toISOString(),
              updatedAt: entry.updatedAt.toISOString(),
            });
          })
          .catch((err) => {
            throw err;
          });
      });

      test('Given a non-existing Journal id then should return 404', () => {
        // Arrange
        const message = 'Journal not found';

        jest
          .spyOn(journalsService, 'createOrUpdateEntry')
          .mockImplementationOnce(() => {
            throw new NotFoundError(message);
          });

        // Act and Assert
        return request(app)
          .post(url)
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ErrorCodes.ItemNotFound,
                message,
              },
            });
          })
          .catch((err) => {
            throw err;
          });
      });

      test('Given a create or update Journal Entry fails then should return 500', () => {
        // Arrange
        jest
          .spyOn(journalsService, 'createOrUpdateEntry')
          .mockImplementationOnce(() => {
            throw new Error();
          });

        // Act and Assert
        return request(app)
          .post(url)
          .expect(500)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ErrorCodes.GeneralException,
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
              },
            });
          })
          .catch((err) => {
            throw err;
          });
      });
    });

    describe('PATCH /:journalId/entries/:entryId', () => {
      const entry: JournalEntry = {
        id: 'id',
        journalId: 'journalId',
        title: 'title',
        text: 'text',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const url = `${baseUrl}/${entry.journalId}/entries/${entry.id}`;

      test('Should update a Journal Entry', () => {
        // Arrange
        jest.spyOn(journalsService, 'updateEntry').mockResolvedValueOnce(entry);

        // Act and Assert
        return request(app)
          .patch(url)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              ...entry,
              createdAt: entry.createdAt.toISOString(),
              updatedAt: entry.updatedAt.toISOString(),
            });
          })
          .catch((err) => {
            throw err;
          });
      });

      test('Given a non-existing Journal id then should return 404', () => {
        // Arrange
        const message = 'Journal not found';

        jest
          .spyOn(journalsService, 'updateEntry')
          .mockImplementationOnce(() => {
            throw new NotFoundError(message);
          });

        // Act and Assert
        return request(app)
          .patch(url)
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ErrorCodes.ItemNotFound,
                message,
              },
            });
          })
          .catch((err) => {
            throw err;
          });
      });

      test('Given a non-existing Journal Entry id then should return 404', () => {
        // Arrange
        const message = 'Journal Entry not found';

        jest
          .spyOn(journalsService, 'updateEntry')
          .mockImplementationOnce(() => {
            throw new NotFoundError(message);
          });

        // Act and Assert
        return request(app)
          .patch(url)
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ErrorCodes.ItemNotFound,
                message,
              },
            });
          })
          .catch((err) => {
            throw err;
          });
      });

      test('Given a update Journal Entry fails then should return 500', () => {
        // Arrange
        jest
          .spyOn(journalsService, 'updateEntry')
          .mockImplementationOnce(() => {
            throw new Error();
          });

        // Act and Assert
        return request(app)
          .patch(url)
          .expect(500)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ErrorCodes.GeneralException,
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
              },
            });
          })
          .catch((err) => {
            throw err;
          });
      });
    });

    describe('GET /:journalId/entries', () => {
      const journalId = 'journalId';

      const entries: JournalEntry[] = [
        {
          id: 'id',
          journalId,
          title: 'title',
          text: 'text',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'another id',
          journalId,
          title: 'another title',
          text: 'another text',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const url = `${baseUrl}/${journalId}/entries`;

      test('Should get a list of Entries by Journal id', () => {
        // Arrange
        jest
          .spyOn(journalsService, 'listEntries')
          .mockResolvedValueOnce(entries);

        // Act and Assert
        return request(app)
          .get(url)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(journalsService.listEntries).toBeCalledWith({
              where: {
                journalId,
              },
              orderBy: [],
            });

            expect(response.body).toStrictEqual([
              {
                ...entries[0],
                createdAt: entries[0].createdAt.toISOString(),
                updatedAt: entries[0].updatedAt.toISOString(),
              },
              {
                ...entries[1],
                createdAt: entries[1].createdAt.toISOString(),
                updatedAt: entries[1].updatedAt.toISOString(),
              },
            ]);
          })
          .catch((err) => {
            throw err;
          });
      });

      test('Given optional orderBy query param then should return ordered list', () => {
        // Arrange
        jest
          .spyOn(journalsService, 'listEntries')
          .mockResolvedValueOnce(entries);

        // Act and Assert
        return request(app)
          .get(`${url}?orderBy=created desc/title`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(() => {
            expect(journalsService.listEntries).toBeCalledWith({
              where: {
                journalId,
              },
              orderBy: [
                {
                  column: 'created',
                  order: 'desc',
                },
                {
                  column: 'title',
                  order: 'asc',
                },
              ],
            });
          })
          .catch((err) => {
            throw err;
          });
      });

      test.each([['orderBy[]=first&orderBy[]=second', 'first,second']])(
        'Given invalid orderBy %p then should return 400',
        (invalidOrderBy, errorMessage) => {
          // Act and Assert
          return request(app)
            .get(`${url}?${invalidOrderBy}`)
            .expect(400)
            .expect('Content-Type', /json/)
            .then((response: Response) => {
              expect(response.body).toStrictEqual({
                error: {
                  code: ErrorCodes.InvalidParameterFormat,
                  message: `Invalid orderBy ${errorMessage}`,
                },
              });
            })
            .catch((err) => {
              throw err;
            });
        }
      );
    });
  });
});
