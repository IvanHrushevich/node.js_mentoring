import express from 'express';

import { AuthForm } from '../interfaces/index';
import { AuthService } from '../services/index';
import { errorHandled } from '../logging/index';

const loginService = new AuthService();

class AuthController {
    @errorHandled
    async postLogin(req: express.Request, res: express.Response): Promise<any> {
        const authForm: AuthForm = req.body;

        try {
            const token: { token: string } = await loginService.authenticate(
                authForm
            );

            res.status(200).json({ token });
        } catch (error) {
            throw error;
        }
    }
}

const authController: AuthController = new AuthController();

export const authRouter: express.Router = express.Router();

authRouter.post('/', authController.postLogin);
