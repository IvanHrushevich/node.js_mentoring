import express from 'express';

import { UserManagementService } from '../services/index';
import { UserDAO } from '../data-access/index';
import { userModel } from '../models/index';

const userDAO = new UserDAO(userModel);
const usersService = new UserManagementService(userDAO);

const getById = (req, res) => {
    const id = req.params.id;
    usersService.getUserById(id).then(user => {
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    });
};

const getUsers = (req, res) => {
    const searchStr = req.query.login;
    const limit = req.query.limit;

    usersService.getFilteredUsers(searchStr, limit).then(filteredUsers => {
        if (filteredUsers) {
            res.json(filteredUsers);
        } else {
            res.sendStatus(404);
        }
    });
};

const postUser = (req, res) => {
    const user = req.body;
    usersService
        .saveUser(user)
        .then(savedUser => res.status(201).json(savedUser))
        .catch(error => res.status(400).json(error));
};

const putUserById = (req, res) => {
    const id = req.params.id;
    const reqUser = req.body;

    usersService
        .updateUser(id, reqUser)
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json(error));
};

const deleteUserById = (req, res) => {
    const id = req.params.id;
    usersService.deleteUser(id).then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.sendStatus(404);
        }
    });
};

export const usersRouter = express.Router();

usersRouter.get('/:id', getById);
usersRouter.get('/', getUsers);
usersRouter.post('/', postUser);
usersRouter.put('/:id', putUserById);
usersRouter.delete('/:id', deleteUserById);
