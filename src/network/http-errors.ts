class HttpError extends Error { //we create a new class that extends the native Error class!
    constructor(message?: string) {
        super(message)
        this.name = this.constructor.name //this will make sure when we create a subClass witht he new key, the error's name would be assigned to the subClass's name!
    }
}

/**
 * Status code: 400
 */
export class BadRequstError extends HttpError {}
/**
 * Status code: 401
 */
export class UnauthorizedError extends HttpError {}
/**
 * Status code: 404
 */
export class NotFoundError extends HttpError {}
/**
 * Status code: 409 (already exists)
 */
export class ConflictError extends HttpError {}
/**
 * Status code: 429
 */
export class TooManyReequestsError extends HttpError {}