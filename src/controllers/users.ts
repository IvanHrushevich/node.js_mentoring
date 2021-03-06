import express from 'express';

import { UserService } from '../services/index';
import { UserDAO } from '../data-access/index';
import { UsersModel } from '../models/index';
import { User, SeqUpdateResponse } from '../interfaces/index';
import { groupDAO } from './groups';
import { HttpError } from './../utils/index';
import { errorHandled } from '../logging/index';

const userDAO: UserDAO = new UserDAO(UsersModel, groupDAO);
export const usersService = new UserService(userDAO);

const errorNotFoundById: HttpError = new HttpError(
    404,
    'Not found',
    'No user was found by specified id'
);

const errorBadRequest: HttpError = new HttpError(400, 'Bad request');

class UsersController {
    @errorHandled
    async getById(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        const user: User | null = await usersService.getUserById(id);

        if (user) {
            res.json(user);
        } else {
            throw errorNotFoundById;
        }
    }

    @errorHandled
    async getUsers(req: express.Request, res: express.Response) {
        const searchStr: string = req.query.login;
        const limit: number | undefined = Number(req.query.limit) || undefined;

        const filteredUsers: User[] = await usersService.getFilteredUsers(
            searchStr,
            limit
        );

        if (filteredUsers.length) {
            res.json(filteredUsers);
        } else {
            const error: HttpError = new HttpError(
                404,
                'Not found',
                'No users were found with specified parameters'
            );

            throw error;
        }
    }

    @errorHandled
    async postUser(req: express.Request, res: express.Response) {
        const user = req.body;

        try {
            const savedUser: User = await usersService.saveUser(user);
            res.status(201).json(savedUser);
        } catch (error) {
            throw error;
        }
    }

    @errorHandled
    async putUserById(req: express.Request, res: express.Response) {
        const id: string = req.params.id;
        const reqUser: User = req.body;

        try {
            const result: SeqUpdateResponse<User> = await usersService.updateUser(
                id,
                reqUser
            );
            res.status(200).json(result);
        } catch (err) {
            throw errorBadRequest;
        }
    }

    @errorHandled
    async deleteUserById(req: express.Request, res: express.Response) {
        const id: string = req.params.id;

        try {
            const result: number = await usersService.deleteUser(id);
            res.status(200).json(result);
        } catch (err) {
            throw errorNotFoundById;
        }
    }
}

const usersController: UsersController = new UsersController();

export const usersRouter: express.Router = express.Router();

usersRouter.get('/:id', usersController.getById);
usersRouter.get('/', usersController.getUsers);
usersRouter.post('/', usersController.postUser);
usersRouter.put('/:id', usersController.putUserById);
usersRouter.delete('/:id', usersController.deleteUserById);
