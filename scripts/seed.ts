import db from '../src/infrastructure/db';

export const run = async (): Promise<void> => {
  await db.seed.run();
  process.exit();
};

run();
