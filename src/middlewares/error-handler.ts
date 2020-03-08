import express from 'express';

import { logger } from '../logging/index';
import { HttpError } from '../utils/http-error';

export function errorHandler(
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    if (err instanceof HttpError) {
        res.status(err.status).send(err);
    } else {
        logger.error(`unexpected error: ${JSON.stringify(err)}`);
        res.status(500).send(err);
    }
}
