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
            const nextFn: express.NextFunction = args[2];

            logger.error('[controller] method name: ', propertyName);
            logger.error('[controller] url: ', args[0].originalUrl);
            logger.error('[controller] method: ', args[0].method);
            logger.error('[controller] params: ', args[0].params);
            logger.error('[controller] error message: ', err.message);

            nextFn(err);
        }
    };
}
