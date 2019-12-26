import express from 'express';

import usersRouter from './routes/users';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', usersRouter);

app.listen(port, () => console.log(`Users app listening on port ${port}!`));
