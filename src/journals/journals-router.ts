import * as journalsService from './journals-service';
import { Joi, Segments, celebrate } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import { orderByRegex, toOrderBy } from '../query/order-by';
import { StatusCodes } from 'http-status-codes';

export const journalsRouter = express.Router();

journalsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body;

      const userId = req.user.sub;

      const journal = await journalsService.createJournal(userId, title);

      res.status(StatusCodes.CREATED).json(journal);
    } catch (err) {
      next(err);
    }
  }
);

journalsRouter.post(
  '/entries',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      text: Joi.string().required(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, text } = req.body;

      const userId = req.user.sub;

      const entry = await journalsService.createOrUpdateEntry(
        userId,
        title,
        text
      );

      res.status(StatusCodes.CREATED).send(entry);
    } catch (err) {
      next(err);
    }
  }
);

journalsRouter.patch(
  '/entries/:entryId',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string(),
      text: Joi.string(),
    }),
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entryId } = req.params;

      const userId = req.user.sub;

      const entry = await journalsService.updateEntry(
        userId,
        entryId,
        req.body
      );

      res.send(entry);
    } catch (err) {
      next(err);
    }
  }
);

journalsRouter.get(
  '/entries',
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
      const { orderBy } = req.query;

      const userId = req.user.sub;

      const entries = await journalsService.listEntries(userId, {
        orderBy: orderBy ? toOrderBy(orderBy as string) : [],
      });

      res.json(entries);
    } catch (err) {
      next(err);
    }
  }
);
