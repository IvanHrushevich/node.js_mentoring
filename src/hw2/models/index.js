import { Sequelize } from 'sequelize';

const connectionURI =
    'postgres://bbyhlqwvihzmju:1cfe04e8c8c489e71fbb9d63b44a8039af06add5289106f0d1518e4efa27b978@ec2-54-228-237-40.eu-west-1.compute.amazonaws.com:5432/dd9jsqdcncjd1t';

export const db = new Sequelize(connectionURI, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    define: {
        timestamps: false
    }
});

export * from './user.model';
