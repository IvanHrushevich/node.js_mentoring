import express from 'express';
import jsonwebtoken from 'jsonwebtoken';

import { AuthForm } from './../interfaces/index';
import { usersService } from '../controllers/index';
import { HttpError } from '../utils/index';
import { SECRET } from './secret';

export async function authentication(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): Promise<any> {
    const invalidTokenError: HttpError = new HttpError(
        403,
        'Forbidden Error',
        'Invalid token was provided'
    );

    const authForm: AuthForm = req.body;

    if (!authForm || !authForm.login || !authForm.password) {
        next(invalidTokenError);
    } else {
        const user = await usersService.getUserByName(authForm.login);

        if (!user || user.password !== authForm.password) {
            next(invalidTokenError);
        } else {
            const hour = 60 * 60 * 1000;
            const payload = { sub: user.id };
            const token = jsonwebtoken.sign(payload, SECRET, {
                expiresIn: hour
            });

            res.send({ token });
        }
    }
}
