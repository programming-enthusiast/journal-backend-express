import * as inspirationsService from './inspirations-service';
import { ErrorCodes, NotFoundError, ResponseError } from '../errors';
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inspiration = await inspirationsService.createInspiration(
      req.body.text
    );

    res.status(StatusCodes.CREATED).json(inspiration);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const inspirations = await inspirationsService.listInspirations();

    res.json(inspirations);
  } catch (err) {
    next(err);
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await inspirationsService.deleteInspiration(id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      if (err instanceof NotFoundError) {
        next(
          new ResponseError(
            StatusCodes.NOT_FOUND,
            ErrorCodes.ItemNotFound,
            err.message
          )
        );
      }
      next(err);
    }
  }
);

export default router;
