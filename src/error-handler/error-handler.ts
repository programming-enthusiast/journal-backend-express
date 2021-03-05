import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { CelebrateError } from 'celebrate';
import { ErrorResponse } from './error-response';
import { NotFoundError } from '../errors';
import { Response } from 'express';
import { UnauthorizedError } from 'express-jwt';
import { logger } from '../logger';

class ErrorHandler {
  public async handleError(error: Error, res: Response): Promise<void> {
    logger.error(error);

    if (error instanceof NotFoundError) {
      res.status(404);
      res.json(this.makeErrorResponse(ReasonPhrases.NOT_FOUND, error.message));
    } else if (error instanceof UnauthorizedError) {
      res.status(error.status);
      res.json(
        this.makeErrorResponse(ReasonPhrases.UNAUTHORIZED, error.message)
      );
    } else if (error instanceof CelebrateError) {
      const message = Array.from(error.details.entries())
        .map((entry) => entry[1].message)
        .join('\n');

      res.status(StatusCodes.BAD_REQUEST);
      res.json(this.makeErrorResponse(ReasonPhrases.BAD_REQUEST, message));
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json(
        this.makeErrorResponse(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          'Something went wrong'
        )
      );
    }
  }

  private makeErrorResponse(
    code: ReasonPhrases,
    message: string
  ): ErrorResponse {
    return {
      error: {
        code,
        message,
      },
    };
  }
}

const errorHandler = new ErrorHandler();

export { errorHandler };
