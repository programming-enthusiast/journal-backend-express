import * as journalsService from './journals-service';
import { ErrorCodes, NotFoundError, ResponseError } from '../errors';
import express, { NextFunction, Request, Response } from 'express';
import { JournalEntry } from './journal-entry';
import { StatusCodes } from 'http-status-codes';
import { toOrderBy } from '../common/query-methods';

const router = express.Router();

router.post('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const journal = await journalsService.createJournal();

    res.status(StatusCodes.CREATED).json(journal);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:journalId/entries',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { journalId } = req.params;

      const { title, text } = req.body;

      let entry: JournalEntry;

      try {
        entry = await journalsService.createOrUpdateEntry(
          journalId,
          title,
          text
        );
      } catch (err) {
        if (err instanceof NotFoundError) {
          throw new ResponseError(
            StatusCodes.NOT_FOUND,
            ErrorCodes.ItemNotFound,
            err.message
          );
        }
        throw err;
      }

      res.status(StatusCodes.CREATED).send(entry);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/:journalId/entries/:entryId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { journalId, entryId } = req.params;

      let entry: JournalEntry;

      try {
        entry = await journalsService.updateEntry(journalId, entryId, req.body);
      } catch (err) {
        if (err instanceof NotFoundError) {
          throw new ResponseError(
            StatusCodes.NOT_FOUND,
            ErrorCodes.ItemNotFound,
            err.message
          );
        }

        throw err;
      }

      res.send(entry);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/:journalId/entries',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { journalId } = req.params;

      const { orderBy } = req.query;

      if (orderBy && typeof orderBy !== 'string') {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          ErrorCodes.InvalidParameterFormat,
          `Invalid orderBy ${orderBy}`
        );
      }

      const entries = await journalsService.listEntries({
        where: { journalId },
        orderBy: orderBy ? toOrderBy(orderBy) : [],
      });

      res.json(entries);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
