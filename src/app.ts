import express, { NextFunction, Request, Response } from 'express';
import httpLogger from 'pino-http';
import journalsRouter from './journals/journals-router';
import inspirationsRouter from './inspirations/inspirations-router';
import errorHandler from './error-handler';
import logger from './logger';

const app = express();

app.use(express.json());

app.use(
  httpLogger({
    logger,
  })
);

app.use('/api/v1/journals', journalsRouter);
app.use('/api/v1/inspirations', inspirationsRouter);

app.use(
  async (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    await errorHandler.handleError(error, res);
  }
);

export default app;
