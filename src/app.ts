import express, { NextFunction, Request, Response } from 'express';
import { checkJwt } from './auth/check-jwt';
import cors from 'cors';
import { errorHandler } from './error-handler';
import helmet from 'helmet';
import httpLogger from 'pino-http';
import { inspirationsRouter } from './inspirations/inspirations-router';
import { journalsRouter } from './journals/journals-router';
import { logger } from './logger';

const app = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(
  httpLogger({
    logger,
  })
);

app.use(checkJwt);

app.use('/api/v1/journals', journalsRouter);
app.use('/api/v1/inspirations', inspirationsRouter);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    await errorHandler.handleError(error, res);
  }
);

export { app };
