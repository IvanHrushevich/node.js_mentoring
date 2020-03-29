import { Sequelize } from 'sequelize';

const connectionURI: string = process.env.DB_CONNECTION_URI as string;

export const db: Sequelize = new Sequelize(connectionURI, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    define: {
        timestamps: false
    }
});
