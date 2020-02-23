import express from 'express';

import { usersRouter, groupsRouter } from './controllers/index';
import { logger } from './logger';

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

app.use(
    (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.log('!!!!!! ERROR', err);
        logger.log({
            level: 'error',
            message: `unhandled error: ${JSON.stringify(err)}`
        });
        res.status(500).send(err);
    }
);

app.listen(port, () => console.log(`Users app listening on port ${port}!`));
