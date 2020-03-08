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

            logger.warn(`[controller] method name: ${propertyName}`);
            logger.warn(`[controller] url: ${req.originalUrl}`);
            logger.warn(`[controller] method: ${req.method}`);
            logger.warn(`[controller] params: ${JSON.stringify(req.params)}`);
            logger.warn(`[controller] body: ${JSON.stringify(req.body)}`);
            logger.warn(`[controller] error message: ${err.message}`);

            nextFn(err);
        }
    };
}
