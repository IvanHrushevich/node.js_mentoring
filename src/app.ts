import express from 'express';

import { usersRouter, groupsRouter } from './controllers/index';
import { logger } from './logger';
import { HttpError } from './utils/index';

const app: express.Express = express();
const port: string = process.env.PORT || '3000';

app.use(express.json());

// requests logging
app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        logger.log({ level: 'info', message: `req.method: ${req.method}` });
        logger.log({ level: 'info', message: `req.url: ${req.url}` });
        logger.log({
            level: 'info',
            message: `req.query: ${JSON.stringify(req.query)}`
        });
        logger.log({
            level: 'info',
            message: `req.body: ${JSON.stringify(req.body)}`
        });
        next();
    }
);

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

// error handling
app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        logger.log({
            level: 'error',
            message: `unhandled error: ${JSON.stringify(err)}`
        });

        if (err instanceof HttpError) {
            res.status(err.status).send(err);
        } else {
            res.status(500).send(err);
        }
    }
);

process
    .on('unhandledRejection', err => {
        logger.log({
            level: 'error',
            message: `unhandledRejection: ${err}`
        });
    })
    .on('uncaughtException', err => {
        logger.log({
            level: 'error',
            message: `uncaughtException: ${err}`
        });
    });

app.listen(port, () => console.log(`Users app listening on port ${port}!`));
