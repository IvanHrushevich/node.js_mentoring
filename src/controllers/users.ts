import express from 'express';

import { UserManagementService } from '../services/index';
import { UserDAO } from '../data-access/index';
import { userModel } from '../models/index';
import { User, UpdateUserResponse } from '../interfaces/index';

const userDAO: UserDAO = new UserDAO(userModel);
const usersService = new UserManagementService(userDAO);

const getById: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const id: string = req.params.id;
    const user: User | null = await usersService.getUserById(id);

    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
};

const getUsers: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const searchStr: string = req.query.login;
    const limit: number | undefined = Number(req.query.limit) || undefined;

    const filteredUsers: User[] = await usersService.getFilteredUsers(
        searchStr,
        limit
    );

    if (filteredUsers) {
        res.json(filteredUsers);
    } else {
        res.sendStatus(404);
    }
};

const postUser: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const user = req.body;

    try {
        const savedUser: User = await usersService.saveUser(user);
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json(error);
    }
};

const putUserById: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const id: string = req.params.id;
    const reqUser: User = req.body;

    try {
        const result: UpdateUserResponse = await usersService.updateUser(
            id,
            reqUser
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
};

const deleteUserById: (
    req: express.Request,
    res: express.Response
) => Promise<void> = async (req, res) => {
    const id: string = req.params.id;

    try {
        const result: number = await usersService.deleteUser(id);
        res.status(200).json(result);
    } catch (error) {
        res.sendStatus(404);
    }
};

export const usersRouter: express.Router = express.Router();

usersRouter.get('/:id', getById);
usersRouter.get('/', getUsers);
usersRouter.post('/', postUser);
usersRouter.put('/:id', putUserById);
usersRouter.delete('/:id', deleteUserById);
