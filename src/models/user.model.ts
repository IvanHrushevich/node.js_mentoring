import { DataTypes, Model, BuildOptions } from 'sequelize';

import { db } from './db';

interface UserModelSeq extends Model {
    readonly id: string;
    readonly login: string;
    readonly password: string;
    readonly age: number;
}

export type UserModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserModelSeq;
};

const UserModel: UserModelStatic = <UserModelStatic>db.define(
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

export { UserModel };
