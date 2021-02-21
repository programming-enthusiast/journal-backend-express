import request, { Response } from 'supertest';
import app from '../app';
import { Journal } from './journal';
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
            expect(response.body.id).toStrictEqual(journal.id);
            expect(response.body.createdAt).toStrictEqual(
              journal.createdAt.toISOString()
            );
            expect(response.body.updatedAt).toStrictEqual(
              journal.updatedAt.toISOString()
            );
          })
          .catch((err) => {
            throw err;
          });
      });
    });
  });
});
