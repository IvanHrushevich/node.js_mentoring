import express from 'express';

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

  return user ? res.json(user) : res.sendStatus(404);
});

useersRouter.get('/', (req, res) => res.json(users));

useersRouter.post('/', (req, res) => {
  const user = req.body;
  console.log('user', user);
  users[user.id] = user;
  res.sendStatus(200);
});

app.use('/users', useersRouter);
