import * as journalsService from './journals-service';
import { db, tables } from '../infrastructure/db';
import { getToken, interceptGetJWKSRequest } from '../test-utils/jwt';
import { isAfter, subDays } from 'date-fns';
import { omit, orderBy } from 'lodash';
import request, { Response } from 'supertest';
import { JournalEntry } from './journal-entry';
import { NotFoundError } from '../errors';
import { ReasonPhrases } from 'http-status-codes';
import { app } from '../app';
import { cleanDb } from '../test-utils/clean-db';
import { orderByRegex } from '../query/order-by';

describe('journals-router', () => {
  const userId = 'my user';

  const authorization = `Bearer ${getToken(userId)}`;

  beforeEach(interceptGetJWKSRequest);

  afterEach(cleanDb);

  describe('/api/v1/journals', () => {
    const baseUrl = '/api/v1/journals';

    describe('POST /', () => {
      test('Should create a Journal', () => {
        // Arrange
        const requestBody = {
          title: 'my journal',
        };

        // Act and Assert
        return request(app)
          .post(baseUrl)
          .set('Authorization', authorization)
          .send(requestBody)
          .expect(201)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body.id).toBeDefined();
            expect(response.body.userId).toBe(userId);
            expect(Date.parse(response.body.createdAt)).toBeTruthy();
            expect(Date.parse(response.body.updatedAt)).toBeTruthy();
          });
      });

      test('Given no title is sent then should return 400', () => {
        // Act and Assert
        return request(app)
          .post(baseUrl)
          .set('Authorization', authorization)
          .expect(400)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.BAD_REQUEST,
                message: '"title" is required',
              },
            });
          });
      });

      test('Given create journal fails then should return 500', () => {
        // Arrange
        const requestBody = {
          title: 'my journal',
        };

        jest
          .spyOn(journalsService, 'createJournal')
          .mockImplementationOnce(() => {
            throw new Error();
          });

        // Act and Assert
        return request(app)
          .post(baseUrl)
          .set('Authorization', authorization)
          .send(requestBody)
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

    describe('POST /entries', () => {
      const url = `${baseUrl}/entries`;

      const requestBody = {
        title: "Solve a Rubik's cube",
        text:
          "Today I went to the internet to search how to solve a Rubik's cube\n. It was fun!",
      };

      test('Should create a Journal Entry', async () => {
        // Arrange
        const journal = await journalsService.createJournal(
          userId,
          'a journal'
        );

        // Act and Assert
        return request(app)
          .post(url)
          .set('Authorization', authorization)
          .send(requestBody)
          .expect(201)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body.id).toBeDefined();
            expect(response.body.journalId).toBe(journal.id);
            expect(Date.parse(response.body.createdAt)).toBeTruthy();
            expect(Date.parse(response.body.updatedAt)).toBeTruthy();
          });
      });

      test('Given title is undefined then should return 400', () => {
        // Act and Assert

        return request(app)
          .post(url)
          .set('Authorization', authorization)
          .send(omit(requestBody, 'title'))
          .expect(400)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.BAD_REQUEST,
                message: '"title" is required',
              },
            });
          });
      });

      test('Given text is undefined then should return 400', () => {
        // Act and Assert
        return request(app)
          .post(url)
          .set('Authorization', authorization)
          .send(omit(requestBody, 'text'))
          .expect(400)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.BAD_REQUEST,
                message: '"text" is required',
              },
            });
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
          .set('Authorization', authorization)
          .send(requestBody)
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
          .set('Authorization', authorization)
          .send(requestBody)
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

    describe('PATCH /entries/:entryId', () => {
      const requestBody = {
        title: 'my updated title',
        text: 'my updated text',
      };

      let entry: JournalEntry;
      let url: string;

      const setup = async (): Promise<JournalEntry> => {
        await journalsService.createJournal(userId, 'my journal');

        const entry = await journalsService.createOrUpdateEntry(
          userId,
          'my title',
          'my text'
        );

        return entry;
      };

      beforeAll(async () => {
        entry = await setup();
        url = `${baseUrl}/entries/${entry.id}`;
      });

      test('Should update a Journal Entry', () => {
        // Act and Assert
        return request(app)
          .patch(url)
          .set('Authorization', authorization)
          .send(requestBody)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(omit(response.body, 'updatedAt')).toStrictEqual(
              omit(
                {
                  ...entry,
                  title: requestBody.title,
                  text: requestBody.text,
                  createdAt: entry.createdAt.toISOString(),
                },
                'updatedAt'
              )
            );

            expect(
              isAfter(new Date(response.body.updatedAt), entry.updatedAt)
            ).toBe(true);
          });
      });

      test.each([null, {}, []])(
        'Given title is not a string then should return 400',
        (title) => {
          // Act and Assert
          return request(app)
            .patch(url)
            .set('Authorization', authorization)
            .send({ title })
            .expect(400)
            .expect('Content-Type', /json/)
            .then((response: Response) => {
              expect(response.body).toStrictEqual({
                error: {
                  code: ReasonPhrases.BAD_REQUEST,
                  message: '"title" must be a string',
                },
              });
            });
        }
      );

      test.each([null, {}, []])(
        'Given text is not a string then should return 400',
        (text) => {
          // Act and Assert
          return request(app)
            .patch(url)
            .set('Authorization', authorization)
            .send({ text })
            .expect(400)
            .expect('Content-Type', /json/)
            .then((response: Response) => {
              expect(response.body).toStrictEqual({
                error: {
                  code: ReasonPhrases.BAD_REQUEST,
                  message: '"text" must be a string',
                },
              });
            });
        }
      );

      test('Given a non-existing User then should return 404', () => {
        // Arrange
        const userId = 'non-existing-user';

        const authorization = `Bearer ${getToken(userId)}`;

        // Act and Assert
        return request(app)
          .patch(url)
          .set('Authorization', authorization)
          .send(requestBody)
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.NOT_FOUND,
                message: `User ${userId} not found`,
              },
            });
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
          .set('Authorization', authorization)
          .send(requestBody)
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

    describe('GET /entries', () => {
      const url = `${baseUrl}/entries`;

      let entries: JournalEntry[];

      const setup = async (): Promise<JournalEntry[]> => {
        const journal = await journalsService.createJournal(
          userId,
          'my journal'
        );

        const entries: JournalEntry[] = [
          {
            id: 'id',
            journalId: journal.id,
            title: 'title',
            text: 'text',
            createdAt: subDays(new Date(), 14),
            updatedAt: subDays(new Date(), 14),
          },
          {
            id: 'another id',
            journalId: journal.id,
            title: 'another title',
            text: 'another text',
            createdAt: subDays(new Date(), 7),
            updatedAt: subDays(new Date(), 7),
          },
          {
            id: 'yet another id',
            journalId: journal.id,
            title: 'yet another title',
            text: 'yet another text',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        for (const entry of entries) {
          await db<JournalEntry>(tables.entries).insert(entry);
        }

        return entries;
      };

      beforeEach(async () => {
        entries = await setup();
      });

      test("Should get a list of the User's Entries", () => {
        // Act and Assert
        return request(app)
          .get(url)
          .set('Authorization', authorization)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual(
              entries.map((entry) => {
                return {
                  ...entry,
                  createdAt: entry.createdAt.toISOString(),
                  updatedAt: entry.updatedAt.toISOString(),
                };
              })
            );
          });
      });

      test('Given optional orderBy query param then should return ordered list', () => {
        // Act and Assert
        return request(app)
          .get(`${url}?orderBy=created_at desc/title`)
          .set('Authorization', authorization)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual(
              orderBy(entries, ['createdAt', 'title'], ['desc', 'asc']).map(
                (entry) => {
                  return {
                    ...entry,
                    createdAt: entry.createdAt.toISOString(),
                    updatedAt: entry.updatedAt.toISOString(),
                  };
                }
              )
            );
          });
      });

      test.each([['orderBy[]=first&orderBy[]=second']])(
        'Given non-string orderBy then should return 400',
        (invalidOrderBy) => {
          // Act and Assert
          return request(app)
            .get(`${url}?${invalidOrderBy}`)
            .set('Authorization', authorization)
            .expect(400)
            .expect('Content-Type', /json/)
            .then((response: Response) => {
              expect(response.body).toStrictEqual({
                error: {
                  code: ReasonPhrases.BAD_REQUEST,
                  message: '"orderBy" must be a string',
                },
              });
            });
        }
      );

      test.each([
        [
          'created_at invalid-ordering',
          'created_at/',
          'created_at desc/title/',
        ],
      ])(
        'Given invalid orderBy %p then should return 400',
        (invalidOrderBy) => {
          // Act and Assert
          return request(app)
            .get(`${url}?orderBy=${invalidOrderBy}`)
            .set('Authorization', authorization)
            .expect(400)
            .expect('Content-Type', /json/)
            .then((response: Response) => {
              expect(response.body).toStrictEqual({
                error: {
                  code: ReasonPhrases.BAD_REQUEST,
                  message: `"orderBy" with value "${invalidOrderBy}" fails to match the required pattern: ${orderByRegex}`,
                },
              });
            });
        }
      );

      test('Given a non-existing User then should return 404', () => {
        // Arrange
        const userId = 'non-existing-user';

        const authorization = `Bearer ${getToken(userId)}`;

        // Act and Assert
        return request(app)
          .get(url)
          .set('Authorization', authorization)
          .expect(404)
          .expect('Content-Type', /json/)
          .then((response: Response) => {
            expect(response.body).toStrictEqual({
              error: {
                code: ReasonPhrases.NOT_FOUND,
                message: `User ${userId} not found`,
              },
            });
          });
      });

      test('Given failure then should return 500', () => {
        // Arrange
        jest
          .spyOn(journalsService, 'listEntries')
          .mockImplementationOnce(() => {
            throw new Error();
          });

        // Act and Assert
        return request(app)
          .get(url)
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
