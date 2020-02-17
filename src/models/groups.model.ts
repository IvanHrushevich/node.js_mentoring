import { DataTypes, Model, BuildOptions } from 'sequelize';

import { Permission } from '../interfaces/index';
import { db } from './db';
import { UsersModel } from './users.model';

interface GroupsModelSeq extends Model {
    readonly id: string;
    readonly name: string;
    readonly permissions: Permission[];
}

export type GroupsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): GroupsModelSeq;
    associate: () => void;
};

const GroupsModel: GroupsModelStatic = <GroupsModelStatic>db.define('Groups', {
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
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
});

GroupsModel.associate = function() {
    this.belongsToMany(UsersModel, {
        through: 'UserGroup',
        as: 'users'
    });
};

export { GroupsModel };
