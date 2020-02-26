import express from 'express';

import { logger } from './logger';

export function errorHandled(
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
        try {
            await originalMethod.apply(this, args);
        } catch (err) {
            const req: any = args[0];
            const nextFn: express.NextFunction = args[2];

            logger.error(`[controller] method name: ${propertyName}`);
            logger.error(`[controller] url: ${req.originalUrl}`);
            logger.error(`[controller] method: ${req.method}`);
            logger.error(`[controller] params: ${JSON.stringify(req.params)}`);
            logger.error(`[controller] body: ${JSON.stringify(req.body)}`);
            logger.error(`[controller] error message: ${err.message}`);

            nextFn(err);
        }
    };
}
