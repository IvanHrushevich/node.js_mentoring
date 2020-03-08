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

            logger.warn(`method name: ${propertyName}`);
            logger.warn(`url: ${req.originalUrl}`);
            logger.warn(`method: ${req.method}`);
            logger.warn(`params: ${JSON.stringify(req.params)}`);
            logger.warn(`body: ${JSON.stringify(req.body)}`);

            nextFn(err);
        }
    };
}
