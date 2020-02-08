import express from 'express';

import { usersRouter } from './controllers/index';

const app: express.Express = express();
const port: string = process.env.PORT || '3000';

app.use(express.json());

app.use('/users', usersRouter);

app.listen(port, () => console.log(`Users app listening on port ${port}!`));
