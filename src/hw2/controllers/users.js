import express from 'express';

import { UserManagementService } from '../services/index';
import { UserDAO } from '../data-access/index';
import { userModel } from '../models/index';

const userDAO = new UserDAO(userModel);
const usersService = new UserManagementService(userDAO);

const getById = async (req, res) => {
    const id = req.params.id;
    const user = await usersService.getUserById(id);

    if (user) {
        res.json(user);
    } else {
        res.sendStatus(404);
    }
};

const getUsers = async (req, res) => {
    const searchStr = req.query.login;
    const limit = req.query.limit;

    const filteredUsers = await usersService.getFilteredUsers(searchStr, limit);

    if (filteredUsers) {
        res.json(filteredUsers);
    } else {
        res.sendStatus(404);
    }
};

const postUser = async (req, res) => {
    const user = req.body;

    try {
        const savedUser = await usersService.saveUser(user);
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json(error);
    }
};

const putUserById = async (req, res) => {
    const id = req.params.id;
    const reqUser = req.body;

    try {
        const result = await usersService.updateUser(id, reqUser);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
};

const deleteUserById = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await usersService.deleteUser(id);
        res.status(200).json(result);
    } catch (error) {
        res.sendStatus(404);
    }
};

export const usersRouter = express.Router();

usersRouter.get('/:id', getById);
usersRouter.get('/', getUsers);
usersRouter.post('/', postUser);
usersRouter.put('/:id', putUserById);
usersRouter.delete('/:id', deleteUserById);
