import express from 'express';

const app = express();
const port = 3000;

const users = {};

app.listen(port, () => console.log(`Users app listening on port ${port}!`));

const useersRouter = express.Router();
useersRouter.use(express.json());

useersRouter.get('/', (req, res) => res.json(users));

useersRouter.post('/', (req, res) => {
  const user = req.body;
  console.log('user', user);
  users[user.id] = user;
  res.sendStatus(200);
});

app.use('/users', useersRouter);
