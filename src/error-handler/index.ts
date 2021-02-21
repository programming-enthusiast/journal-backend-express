import { Response } from 'express'
import { ErrorCode, ResponseError } from '../errors'

class ErrorHandler {
  public async handleError(error: Error, res: Response): Promise<void> {
    console.log(error)

    if (error instanceof ResponseError) {
      res.status(error.status).json({
        error: {
          code: error.code,
          message: error.message,
        },
      })
    } else {
      res.status(500).json({
        error: {
          code: ErrorCode.generalException,
          message: 'Internal Server Error',
        },
      })
    }
  }
}

const errorHandler = new ErrorHandler()

export default errorHandler
