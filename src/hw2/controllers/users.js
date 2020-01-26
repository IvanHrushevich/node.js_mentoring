import express from 'express';

import { userManagementService } from '../services/index';

const getById = (req, res) => {
    const id = req.params.id;
    userManagementService.getUserById(id).then(user => {
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

    userManagementService
        .getFilteredUsers(searchStr, limit)
        .then(filteredUsers => {
            if (filteredUsers) {
                res.json(filteredUsers);
            } else {
                res.sendStatus(404);
            }
        });
};

const postUser = (req, res) => {
    const user = req.body;
    userManagementService
        .saveUser(user)
        .then(savedUser => res.status(201).json(savedUser))
        .catch(error => res.status(400).json(error));
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
    userManagementService.deleteUser(id).then(user => {
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
