import { ErrorCodes, ResponseError } from '../errors';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { CelebrateError } from 'celebrate';
import { ErrorResponse } from './error-response';
import { Response } from 'express';
import logger from '../logger';

class ErrorHandler {
  public async handleError(error: Error, res: Response): Promise<void> {
    logger.error(error);

    if (error instanceof ResponseError) {
      res.status(error.status);
      res.json(this.makeErrorResponse(error.code, error.message));
    } else if (error instanceof CelebrateError) {
      const message = Array.from(error.details.entries())
        .map((entry) => entry[1].message)
        .join('\n');

      res.status(StatusCodes.BAD_REQUEST);
      res.json(this.makeErrorResponse(ErrorCodes.InvalidRequest, message));
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json(
        this.makeErrorResponse(
          ErrorCodes.GeneralException,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  private makeErrorResponse(code: string, message: string): ErrorResponse {
    return {
      error: {
        code,
        message,
      },
    };
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
