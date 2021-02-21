export class NotFoundError extends Error {
  constructor(public readonly message: string) {
    super(message)

    // Set the prototype explicitly. See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
