import express, { NextFunction, Request, Response } from 'express';
import * as inspirationsService from './inspirations-service';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inspiration = await inspirationsService.createInspiration(
      req.body.text
    );

    res.status(201).json(inspiration);
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

export default router;
