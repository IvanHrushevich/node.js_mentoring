import express from 'express';

import { logger } from '../logging/index';
import { HttpError } from '../utils/http-error';

export function errorHandler(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    let resultError: HttpError = err;
    if (!(err instanceof HttpError)) {
        resultError = new HttpError(500, 'Unexpected error', err);
    }

    const errorMessage: string = `${resultError.title || ''}: ${JSON.stringify(
        resultError.detail
    )}`;

    if (resultError.status < 500) {
        logger.warn(errorMessage);
    } else {
        logger.error(errorMessage);
    }

    res.status(resultError.status).send(resultError);
}
