import * as journalsService from './journals-service';
import { ErrorCodes, NotFoundError, ResponseError } from '../errors';
import { Joi, Segments, celebrate } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import { orderByRegex, toOrderBy } from '../query/options/order-by';
import { JournalEntry } from './journal-entry';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body;

      const journal = await journalsService.createJournal(title);

      res.status(StatusCodes.CREATED).json(journal);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:journalId/entries',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      text: Joi.string().required(),
    }),
  }),
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
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string(),
      text: Joi.string(),
    }),
  }),
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
  celebrate({
    [Segments.QUERY]: {
      orderBy: Joi.string().regex(orderByRegex),
    },
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string(),
      text: Joi.string(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { journalId } = req.params;

      const { orderBy } = req.query;

      const entries = await journalsService.listEntries({
        where: { journalId },
        orderBy: orderBy ? toOrderBy(orderBy as string) : [],
      });

      res.json(entries);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
