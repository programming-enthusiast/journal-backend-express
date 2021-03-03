import { db } from '../src/infrastructure/db';

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.migrate.rollback();
  await db.destroy();
});
