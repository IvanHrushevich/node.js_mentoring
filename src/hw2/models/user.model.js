import { DataTypes, Sequelize } from 'sequelize';

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
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }
        });
    }
}
