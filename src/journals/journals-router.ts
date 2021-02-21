import express, { Request, Response } from 'express'
import * as journalsService from './journals-service'

const router = express.Router()

router.post('/', async (_req: Request, res: Response) => {
  const journal = await journalsService.createJournal()

  res.status(201).json(journal)
})

router.post('/:journalId/entries', async (req: Request, res: Response) => {
  const { journalId } = req.params

  const { title, text } = req.body

  const entry = await journalsService.upsertEntry(journalId, title, text)

  res.status(201).send(entry)
})

router.get('/:journalId/entries', async (req: Request, res: Response) => {
  const { journalId } = req.params

  const entries = await journalsService.listEntries({
    where: { journalId },
    orderBy: [{ column: 'createdAt', order: 'asc' }],
  })

  res.json(entries)
})

export default router
