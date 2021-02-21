import express, { Request, Response } from 'express'
import * as journalsService from './journals-service'

const router = express.Router()

router.post('/', async (_req: Request, res: Response) => {
  const journal = await journalsService.createJournal()

  res.status(201).json(journal)
})

router.post('/{journalId}/entries', async (req: Request, res: Response) => {
  console.log('req', req)

  res.status(201).send()
})

router

export default router
