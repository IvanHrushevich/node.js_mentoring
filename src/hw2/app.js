import express from 'express';
import uuid from 'uuid/v1';

import { schema, errorResponse } from './validation/index';

const app = express();
const port = 3000;

const users = {
  1: {
    id: '1',
    login: 'ivan_hrushevich',
    password: 'asdasd1!',
    age: 17,
    isDeleted: false
  }
};

app.listen(port, () => console.log(`Users app listening on port ${port}!`));

const usersRouter = express.Router();
usersRouter.use(express.json());

// request example: http://localhost:3000/users/filter?login=iv&limit=5
usersRouter.get('/filter', (req, res) => {
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
});

usersRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const user = users[id];

  return user && user.isDeleted === false ? res.json(user) : res.sendStatus(404);
});

usersRouter.get('/', (req, res) => res.json(users));

usersRouter.post('/', (req, res) => {
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
});

usersRouter.put('/:id', (req, res) => {
  const id = req.params.id;
  let user = users[id];
  const updatedUser = req.body;

  if (user && user.isDeleted === false) {
    users[id] = {
      ...user,
      ...updatedUser
    };

    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
});

usersRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  const user = users[id];

  if (user && user.isDeleted === false) {
    user.isDeleted = true;

    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
});

app.use('/users', usersRouter);

const getAutoSuggestUsers = (searchStr, limit) => {
  const userList = Object.values(users);
  const filteredUserList = userList.filter(user => user.login.includes(searchStr)).slice(0, limit);

  return filteredUserList;
};
