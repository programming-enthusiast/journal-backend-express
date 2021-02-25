import express, { NextFunction, Request, Response } from 'express';
import errorHandler from './error-handler';
import httpLogger from 'pino-http';
import inspirationsRouter from './inspirations/inspirations-router';
import journalsRouter from './journals/journals-router';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    await errorHandler.handleError(error, res);
  }
);

export default app;
