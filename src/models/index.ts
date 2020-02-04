import { Sequelize } from 'sequelize';

import { UserModel } from './user.model';

const connectionURI: string =
    'postgres://agzctnieexodcz:bda6e1e7a30c12426c357809944e754486e23d4ed40c473146051e078c875e15@ec2-54-195-252-243.eu-west-1.compute.amazonaws.com:5432/dfpm81bm9safgr';

const db: Sequelize = new Sequelize(connectionURI, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    define: {
        timestamps: true,
        paranoid: true
    },
    sync: { force: true }
});

export const userModel: UserModel = new UserModel(db);
