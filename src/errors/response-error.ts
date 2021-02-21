import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from './error-codes';

export class ResponseError extends Error {
  constructor(
    public readonly status: StatusCodes,
    public readonly code: ErrorCodes,
    public readonly message: string
  ) {
    super(message);

    // Set the prototype explicitly. See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}
