import jsonwebtoken from 'jsonwebtoken';

import { AuthForm } from '../interfaces/index';
import { HttpError } from '../utils';
import { usersService } from '../controllers/index';
import { SECRET } from '../middlewares/index';

export class AuthService {
    async authenticate(authForm: AuthForm): Promise<{ token: string }> {
        const invalidTokenError: HttpError = new HttpError(
            403,
            'Forbidden Error',
            'Invalid token was provided'
        );

        let authResult: Promise<{ token: string }>;

        if (!authForm || !authForm.login || !authForm.password) {
            authResult = Promise.reject(invalidTokenError);
        } else {
            const user = await usersService.getUserByName(authForm.login);
            if (!user || user.password !== authForm.password) {
                authResult = Promise.reject(invalidTokenError);
            } else {
                const hour = 60 * 60 * 1000;
                const payload = { sub: user.id };
                const token = jsonwebtoken.sign(payload, SECRET, {
                    expiresIn: hour
                });
                authResult = Promise.resolve({ token });
            }
        }

        return authResult;
    }
}
