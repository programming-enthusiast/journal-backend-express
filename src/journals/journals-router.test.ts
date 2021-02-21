import { ReasonPhrases } from 'http-status-codes';
import request, { Response } from 'supertest';
import app from '../app';
import { ErrorCodes, NotFoundError } from '../errors';
import { Journal } from './journal';
import { JournalEntry } from './journal-entry';
import * as journalsService from './journals-service';

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
            expect(response.body.id).toBe(journal.id);
            expect(response.body.createdAt).toBe(
              journal.createdAt.toISOString()
            );
            expect(response.body.updatedAt).toBe(
              journal.updatedAt.toISOString()
            );
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
            expect(response.body.error.code).toBe(ErrorCodes.GeneralException);
            expect(response.body.error.message).toBe(
              ReasonPhrases.INTERNAL_SERVER_ERROR
            );
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
            expect(response.body.id).toBe(entry.id);
            expect(response.body.title).toBe(entry.title);
            expect(response.body.text).toBe(entry.text);
            expect(response.body.createdAt).toBe(entry.createdAt.toISOString());
            expect(response.body.updatedAt).toBe(entry.updatedAt.toISOString());
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
            expect(response.body.error.code).toBe(ErrorCodes.ItemNotFound);
            expect(response.body.error.message).toBe(message);
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
            expect(response.body.error.code).toBe(ErrorCodes.GeneralException);
            expect(response.body.error.message).toBe(
              ReasonPhrases.INTERNAL_SERVER_ERROR
            );
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
            expect(response.body.id).toBe(entry.id);
            expect(response.body.title).toBe(entry.title);
            expect(response.body.text).toBe(entry.text);
            expect(response.body.createdAt).toBe(entry.createdAt.toISOString());
            expect(response.body.updatedAt).toBe(entry.updatedAt.toISOString());
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
            expect(response.body.error.code).toBe(ErrorCodes.ItemNotFound);
            expect(response.body.error.message).toBe(message);
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
            expect(response.body.error.code).toBe(ErrorCodes.ItemNotFound);
            expect(response.body.error.message).toBe(message);
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
            expect(response.body.error.code).toBe(ErrorCodes.GeneralException);
            expect(response.body.error.message).toBe(
              ReasonPhrases.INTERNAL_SERVER_ERROR
            );
          })
          .catch((err) => {
            throw err;
          });
      });
    });
  });
});
