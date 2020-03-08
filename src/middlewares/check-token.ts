import express from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import { HttpError } from '../utils/index';
import { SECRET } from './secret';

export function checkToken(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void {
    const headerName: string = 'x-access-token';
    const token: string = req.headers[headerName] as string;

    if (token) {
        jwt.verify(token, SECRET, (err: VerifyErrors) => {
            if (err) {
                const invalidTokenError: HttpError = new HttpError(
                    403,
                    'Forbidden Error',
                    'Invalid token was provided'
                );

                throw invalidTokenError;
            } else {
                next();
            }
        });
    } else {
        const noTokenError: HttpError = new HttpError(
            401,
            'Unauthorized Error',
            'No token was provided'
        );

        throw noTokenError;
    }
}
