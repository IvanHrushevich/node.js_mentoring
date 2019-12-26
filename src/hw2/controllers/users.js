import uuid from 'uuid/v1';

import { userSchema, errorResponse } from '../validation/index';

const users = {};

export const getById = (req, res) => {
    const id = req.params.id;
    const user = users[id];

    return user && user.isDeleted === false
        ? res.json(user)
        : res.sendStatus(404);
};

export const getUsers = (req, res) => {
    const searchStr = req.query.login;
    const limit = req.query.limit;

    const isRequestForAllUsers = searchStr === undefined && limit === undefined;

    const activeUsers = Object.values(users).filter(
        user => user.isDeleted === false
    );

    const filteredUserList = isRequestForAllUsers
        ? activeUsers.sort(sortUsers)
        : getAutoSuggestUsers(activeUsers, searchStr, limit);

    if (filteredUserList.length) {
        const filteredUsers = filteredUserList.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {});

        res.json(filteredUsers);
    } else {
        res.sendStatus(404);
    }
};

export const postUser = (req, res) => {
    const user = req.body;

    const { error } = userSchema.validate(user, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        res.status(400).json(errorResponse(error.details));
    } else {
        const id = uuid();
        user.id = id;
        user.isDeleted = false;
        users[user.id] = user;

        res.status(201).json(user);
    }
};

export const putUserById = (req, res) => {
    const reqUser = req.body;

    const { error } = userSchema.validate(reqUser, {
        abortEarly: false,
        allowUnknown: false
    });

    if (error) {
        res.status(400).json(errorResponse(error.details));
    } else {
        const id = req.params.id;
        const user = users[id];

        if (user && user.isDeleted === false) {
            const updatedUser1 = {
                ...user,
                ...reqUser
            };
            users[id] = updatedUser1;

            res.status(200).json(updatedUser1);
        } else {
            res.sendStatus(404);
        }
    }
};

export const deleteUserById = (req, res) => {
    const id = req.params.id;
    const user = users[id];

    if (user && user.isDeleted === false) {
        user.isDeleted = true;

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
};

const getAutoSuggestUsers = (userList, searchStr, limit) => {
    if (searchStr) {
        userList = userList.filter(user => user.login.includes(searchStr));
    }

    return userList.sort(sortUsers).slice(0, limit);
};

const sortUsers = (user1, user2) => (user1.login > user2.login ? 1 : -1);
