import express from 'express';

import { UserManagementService } from '../services/index';

const userManagementService = new UserManagementService();

const getById = (req, res) => {
    const id = req.params.id;
    const user = userManagementService.getUserById(id);

    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
};

const getUsers = (req, res) => {
    const searchStr = req.query.login;
    const limit = req.query.limit;

    const filteredUsers = userManagementService.getFilteredUsers(
        searchStr,
        limit
    );

    if (filteredUsers) {
        res.json(filteredUsers);
    } else {
        res.sendStatus(404);
    }
};

const postUser = (req, res) => {
    const user = req.body;
    const result = userManagementService.saveUser(user);

    if (result.error) {
        res.status(400).json(result.error);
    } else {
        res.status(201).json(result);
    }
};

const putUserById = (req, res) => {
    const id = req.params.id;
    const reqUser = req.body;

    const result = userManagementService.updateUser(id, reqUser);

    if (result.error) {
        if (result.error.validation) {
            res.status(400).json(result.error.validation);
        } else if (result.error.noUser) {
            res.sendStatus(404);
        }
    } else {
        res.status(200).json(result);
    }
};

const deleteUserById = (req, res) => {
    const id = req.params.id;
    const result = userManagementService.deleteUser(id);

    if (result) {
        res.status(200).json(result);
    } else {
        res.sendStatus(404);
    }
};

export const usersRouter = express.Router();

usersRouter.get('/:id', getById);
usersRouter.get('/', getUsers);
usersRouter.post('/', postUser);
usersRouter.put('/:id', putUserById);
usersRouter.delete('/:id', deleteUserById);
