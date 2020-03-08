import express from 'express';
import cors, { CorsOptions } from 'cors';

import { usersRouter, groupsRouter } from './controllers/index';
import { requestLogger, logger } from './logging/index';
import { authentication, errorHandler, checkToken } from './middlewares/index';

const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
    optionsSuccessStatus: 200
};

const app: express.Express = express();
const port: string = process.env.PORT || '3000';

app.use(cors(corsOptions));
app.use(express.json());

app.use(requestLogger);

app.post('/login', authentication);

app.use('/users', checkToken, usersRouter);
app.use('/groups', checkToken, groupsRouter);

app.use(errorHandler);

process
    .on('unhandledRejection', err => logger.error(`unhandledRejection: ${err}`))
    .on('uncaughtException', err => logger.error(`uncaughtException: ${err}`));

app.listen(port, () => console.log(`Users app listening on port ${port}!`));
