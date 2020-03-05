import express from 'express';

import { logger } from './logger';

export function requestLogger(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    logger.info(`req.method: ${req.method}`);
    logger.info(`req.url: ${req.url}`);
    logger.info(`req.query: ${JSON.stringify(req.query)}`);
    logger.info(`req.body: ${JSON.stringify(req.body)}`);

    next();
}
