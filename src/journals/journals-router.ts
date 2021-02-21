import express, { Request, Response, NextFunction } from 'express'
import * as journalsService from './journals-service'

const router = express.Router()

router.post('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const journal = await journalsService.createJournal()

    res.status(201).json(journal)
  } catch (err) {
    next(err)
  }
})

router.post(
  '/:journalId/entries',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { journalId } = req.params

      const { title, text } = req.body

      const entry = await journalsService.createOrUpdateEntry(
        journalId,
        title,
        text
      )

      res.status(201).send(entry)
    } catch (err) {
      next(err)
    }
  }
)

router.patch(
  '/:journalId/entries/:entryId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { journalId, entryId } = req.params

      const entry = await journalsService.updateEntry(
        journalId,
        entryId,
        req.body
      )

      res.status(200).send(entry)
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  '/:journalId/entries',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { journalId } = req.params

      const entries = await journalsService.listEntries({
        where: { journalId },
        orderBy: [{ column: 'createdAt', order: 'asc' }],
      })

      res.json(entries)
    } catch (err) {
      next(err)
    }
  }
)

export default router
