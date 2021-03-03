import * as inspirationsService from './inspirations-service';
import { getToken, jwks } from '../test-utils/jwt';
import request, { Response } from 'supertest';
import { Inspiration } from './inspiration';
import { NotFoundError } from '../errors';
import { ReasonPhrases } from 'http-status-codes';
import app from '../app';
import config from '../config';
import nock from 'nock';

describe('inspirations-router', () => {
  const userId = 'my admin id';

  const authorization = `Bearer ${getToken(userId)}`;

  beforeEach(() => {
    nock(config.auth0.issuer)
      .persist()
      .get('/.well-known/jwks.json')
      .reply(200, jwks);
  });

  describe('/api/v1/inspirations', () => {
    const baseUrl = '/api/v1/inspirations';

    describe('POST /', () => {
      test('Should create an Inspiration', () => {
        // Arrange
        const inspiration: Inspiration = {
          id: 'id',
          text: 'Have a paper airplane contest with some friends',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        jest
          .spyOn(inspirationsService, 'createInspiration')
          .mockResolvedValueOnce(inspiration);

        // Act and Assert
        return request(app)
          .post(baseUrl)
          .set('Authorization', authorization)
          .expect(201)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              ...inspiration,
              createdAt: inspiration.createdAt.toISOString(),
              updatedAt: inspiration.updatedAt.toISOString(),
            });
          });
      });

      test('Given create journal fails then should return 500', () => {
        // Arrange
        jest
          .spyOn(inspirationsService, 'createInspiration')
          .mockImplementationOnce(() => {
            throw new Error();
          });

        // Act and Assert
        return request(app)
          .post(baseUrl)
          .set('Authorization', authorization)
          .expect(500)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
              },
            });
          });
      });
    });

    describe('GET /', () => {
      const inspirations: Inspiration[] = [
        {
          id: 'id',
          text: 'Visit your past teachers',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'another id',
          text: 'Surprise your significant other with something considerate',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      test('Should get a list of all Inspirations', () => {
        // Arrange
        jest
          .spyOn(inspirationsService, 'listInspirations')
          .mockResolvedValueOnce(inspirations);

        // Act and Assert
        return request(app)
          .get(baseUrl)
          .set('Authorization', authorization)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(inspirationsService.listInspirations).toBeCalled();

            expect(response.body).toStrictEqual([
              {
                ...inspirations[0],
                createdAt: inspirations[0].createdAt.toISOString(),
                updatedAt: inspirations[0].updatedAt.toISOString(),
              },
              {
                ...inspirations[1],
                createdAt: inspirations[1].createdAt.toISOString(),
                updatedAt: inspirations[1].updatedAt.toISOString(),
              },
            ]);
          });
      });

      test('Given an Error is thrown then should return 500', () => {
        // Arrange
        jest
          .spyOn(inspirationsService, 'listInspirations')
          .mockImplementationOnce(() => {
            throw new Error('test');
          });

        // Act and Assert
        return request(app)
          .get(baseUrl)
          .set('Authorization', authorization)
          .expect(500)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
              },
            });
          });
      });
    });

    describe('DELETE /:id', () => {
      const id = 'id';

      const url = `${baseUrl}/${id}`;

      test('Given an existing id then should delete the Inspiration and return 204', () => {
        // Arrange
        jest
          .spyOn(inspirationsService, 'deleteInspiration')
          .mockResolvedValueOnce();

        // Act and Assert
        return request(app)
          .delete(url)
          .set('Authorization', authorization)
          .expect(204)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({});
          });
      });

      test('Given a non-existing id then should return 404', () => {
        // Arrange
        const message = `Inspiration id ${id} not found`;

        jest
          .spyOn(inspirationsService, 'deleteInspiration')
          .mockImplementationOnce(() => {
            throw new NotFoundError(message);
          });

        // Act and Assert
        return request(app)
          .delete(url)
          .set('Authorization', authorization)
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.NOT_FOUND,
                message,
              },
            });
          });
      });

      test('Given operation failure then should return 500', () => {
        // Arrange
        jest
          .spyOn(inspirationsService, 'deleteInspiration')
          .mockImplementationOnce(() => {
            throw new Error();
          });

        // Act and Assert
        return request(app)
          .delete(url)
          .set('Authorization', authorization)
          .expect(500)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
              },
            });
          });
      });
    });
  });
});
