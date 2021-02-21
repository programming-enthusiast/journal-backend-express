import db from '../src/infrastructure/db';

afterAll(async () => {
  await db.destroy();
});
