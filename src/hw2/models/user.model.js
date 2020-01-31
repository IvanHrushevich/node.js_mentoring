import { Sequelize } from 'sequelize';

export class UserModel {
    constructor(db) {
        return db.define('user', {
            login: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }
        });
    }
}
