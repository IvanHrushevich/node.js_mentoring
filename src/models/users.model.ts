import { DataTypes, Model, BuildOptions } from 'sequelize';

import { db } from './db';
import { GroupsModel } from './groups.model';

interface UsersModelSeq extends Model {
    readonly id: string;
    readonly login: string;
    readonly password: string;
    readonly age: number;
}

export type UsersModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UsersModelSeq;
};

const UsersModel: UsersModelStatic = <UsersModelStatic>db.define(
    'Users',
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

export { UsersModel };
