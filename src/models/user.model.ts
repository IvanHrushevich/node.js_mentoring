import { DataTypes, Sequelize } from 'sequelize';

export class UserModel {
    constructor(db: Sequelize) {
        return db.define('user', {
            login: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            }
        });
    }
}
