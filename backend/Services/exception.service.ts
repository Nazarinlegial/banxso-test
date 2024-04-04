
class HttpExceptionService extends Error {
    public statusCode
    protected errorMessage

    constructor(message:any, statusCode: number, errorMessage?: string) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.errorMessage = errorMessage
    }

    protected getErrorResponse() {
        return {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: this.message,
                statusCode: this.statusCode,
                errorMessage: this.errorMessage
            }),
        };
    }
}

export class BadRequestError extends HttpExceptionService {
    constructor(message?: string) {
        super('Bad request', 400, message);
    }
}


export class UnauthorizedError extends HttpExceptionService {
    constructor(message?: string) {
        super('Unauthorized', 401, message);
    }
}

export class ServerError extends HttpExceptionService {
    constructor(message?: string) {
        super('Server Error', 500, message);
    }
}

export class InvalidToken extends Error {
    constructor(message:any) {
        super(message);
        this.name = 'InvalidToken';
    }
}


export class InvalidAccessToken extends InvalidToken {
    constructor() {
        super("Invalid access token!");
    }
}

export class InvalidRefreshToken extends InvalidToken {
    constructor() {
        super("Invalid refresh token!");
    }
}