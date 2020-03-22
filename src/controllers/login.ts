import express from 'express';

import { AuthForm } from '../interfaces/index';
import { LoginService } from '../services/index';
import { errorHandled } from '../logging/index';

const loginService = new LoginService();

class LoginController {
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

const loginController: LoginController = new LoginController();

export const loginRouter: express.Router = express.Router();

loginRouter.post('/', loginController.postLogin);
