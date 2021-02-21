import { ReasonPhrases } from 'http-status-codes';
import { Response } from 'express';
import { ErrorCodes, ResponseError } from '../errors';

class ErrorHandler {
  public async handleError(error: Error, res: Response): Promise<void> {
    console.log(error);

    if (error instanceof ResponseError) {
      res.status(error.status).json({
        error: {
          code: error.code,
          message: error.message,
        },
      });
    } else {
      res.status(500).json({
        error: {
          code: ErrorCodes.GeneralException,
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
