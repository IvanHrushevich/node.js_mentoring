import uuid from 'uuid/v1';

import { schema, errorResponse } from '../validation/index';

const users = {
  1: {
    id: '1',
    login: 'ivan_hrushevich',
    password: 'asdasd1!',
    age: 17,
    isDeleted: false
  }
};

export const getFilter = (req, res) => {
  const searchStr = req.query.login;
  const limit = req.query.limit;

  const filteredUserList = getAutoSuggestUsers(searchStr, limit);

  if (filteredUserList.length) {
    const filteredUsers = filteredUserList.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});

    return res.json(filteredUsers);
  } else {
    return res.sendStatus(404);
  }
};

export const getById = (req, res) => {
  const id = req.params.id;
  const user = users[id];

  return user && user.isDeleted === false ? res.json(user) : res.sendStatus(404);
};

export const getUsers = (req, res) => res.json(users);

export const postUser = (req, res) => {
  const user = req.body;

  const { error } = schema.validate(user, {
    abortEarly: false,
    allowUnknown: false
  });

  if (error) {
    return res.status(400).json(errorResponse(error.details));
  } else {
    const id = uuid();
    user.id = id;
    user.isDeleted = false;
    users[user.id] = user;

    return res.sendStatus(200);
  }
};

export const putUserById = (req, res) => {
  const updatedUser = req.body;

  const { error } = schema.validate(updatedUser, {
    abortEarly: false,
    allowUnknown: false
  });

  if (error) {
    return res.status(400).json(errorResponse(error.details));
  } else {
    const id = req.params.id;
    let user = users[id];

    if (user && user.isDeleted === false) {
      users[id] = {
        ...user,
        ...updatedUser
      };

      return res.sendStatus(200);
    } else {
      return res.sendStatus(404);
    }
  }
};

export const deleteUserById = (req, res) => {
  const id = req.params.id;
  const user = users[id];

  if (user && user.isDeleted === false) {
    user.isDeleted = true;

    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
};

const getAutoSuggestUsers = (searchStr, limit) => {
  const userList = Object.values(users);
  const filteredUserList = userList
    .filter(user => user.login.includes(searchStr))
    .sort((user1, user2) => user1.login > user2.login)
    .slice(0, limit);

  return filteredUserList;
};
