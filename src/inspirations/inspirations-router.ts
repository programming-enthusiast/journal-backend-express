import express, { Request, Response } from 'express';
import * as inspirationsService from './inspirations-service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const inspiration = await inspirationsService.createInspiration(
    req.body.text
  );

  res.status(201).json(inspiration);
});

router.get('/', async (_req: Request, res: Response) => {
  const inspirations = await inspirationsService.listInspirations();

  res.json(inspirations);
});

export default router;
