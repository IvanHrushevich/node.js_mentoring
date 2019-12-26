import express from 'express';

import * as usersControllers from '../controllers/users';

const usersRouter = express.Router();

usersRouter.get('/:id', usersControllers.getById);
usersRouter.get('/', usersControllers.getUsers);

usersRouter.post('/', usersControllers.postUser);

usersRouter.put('/:id', usersControllers.putUserById);

usersRouter.delete('/:id', usersControllers.deleteUserById);

export default usersRouter;
