import { ErrorCode } from './error-code';

export class ResponseError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    public readonly message: string
  ) {
    super(message);

    // Set the prototype explicitly. See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}
