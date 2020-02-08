import { DataTypes, Sequelize, Model, BuildOptions } from 'sequelize';

interface UserModelSeq extends Model {
    readonly id: string;
    readonly login: string;
    readonly password: string;
    readonly age: number;
}

export type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserModelSeq;
};

export class UserModel {
    constructor(db: Sequelize) {
        return db.define(
            'user',
            {
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
            },
            {
                timestamps: true,
                paranoid: true
            }
        );
    }
}
