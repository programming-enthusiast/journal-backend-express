import db from '../src/infrastructure/db'

export const run = async (): Promise<void> => {
  await db.migrate.latest()
  process.exit()
}

run()
