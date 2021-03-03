import * as inspirationsService from './inspirations-service';
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const inspirationsRouter = express.Router();

inspirationsRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inspiration = await inspirationsService.createInspiration(
        req.body.text
      );

      res.status(StatusCodes.CREATED).json(inspiration);
    } catch (err) {
      next(err);
    }
  }
);

inspirationsRouter.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const inspirations = await inspirationsService.listInspirations();

      res.json(inspirations);
    } catch (err) {
      next(err);
    }
  }
);

inspirationsRouter.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await inspirationsService.deleteInspiration(id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
);
