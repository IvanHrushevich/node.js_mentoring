import express from 'express';

const app = express();
const port = 3000;
const useersRouter = express.Router();

const users = {};

app.listen(port, () => console.log(`Users app listening on port ${port}!`));

useersRouter.get('/', (req, res) => res.json(users));

app.use('/users', useersRouter);
