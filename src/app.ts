import express from 'express';

import { usersRouter, groupsRouter } from './controllers/index';
import { requestLogger, logger } from './logging/index';
import { errorHandler } from './middlewares/index';

const app: express.Express = express();
const port: string = process.env.PORT || '3000';

app.use(express.json());

app.use(requestLogger);

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.use(errorHandler);

process
    .on('unhandledRejection', err => logger.error(`unhandledRejection: ${err}`))
    .on('uncaughtException', err => logger.error(`uncaughtException: ${err}`));

app.listen(port, () => console.log(`Users app listening on port ${port}!`));
