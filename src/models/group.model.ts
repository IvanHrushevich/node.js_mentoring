import { DataTypes, Sequelize, Model, BuildOptions } from 'sequelize';

import { Permission } from '../interfaces/index';

interface GroupModelSeq extends Model {
    readonly id: string;
    readonly name: string;
    readonly permissions: Permission[];
}

export type GroupModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): GroupModelSeq;
};

export class GroupModel {
    constructor(db: Sequelize) {
        return db.define('group', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            permissions: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });
    }
}
