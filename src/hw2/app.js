import express from 'express';
import uuid from 'uuid/v1';

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

const useersRouter = express.Router();
useersRouter.use(express.json());

useersRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const user = users[id];

  return user && user.isDeleted === false ? res.json(user) : res.sendStatus(404);
});

useersRouter.get('/', (req, res) => res.json(users));

useersRouter.post('/', (req, res) => {
  const user = req.body;
  const id = uuid();
  user.id = id;
  user.isDeleted = false;
  users[user.id] = user;

  return res.sendStatus(200);
});

useersRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  const user = users[id];

  if (user && user.isDeleted === false) {
    user.isDeleted = true;

    return res.sendStatus(200);
  } else {
    return res.sendStatus(404);
  }
});

app.use('/users', useersRouter);
