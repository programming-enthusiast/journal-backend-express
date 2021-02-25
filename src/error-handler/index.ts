import { ErrorCodes, ResponseError } from '../errors';
import { ErrorResponse } from './error-response';
import { ReasonPhrases } from 'http-status-codes';
import { Response } from 'express';
import logger from '../logger';

class ErrorHandler {
  public async handleError(error: Error, res: Response): Promise<void> {
    logger.error(error);

    if (error instanceof ResponseError) {
      res.status(error.status);
      res.json(this.makeErrorResponse(error.code, error.message));
    } else {
      res.status(500);
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
