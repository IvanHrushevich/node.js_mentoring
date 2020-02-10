import { DataTypes, Model, BuildOptions } from 'sequelize';

import { db } from './db';

interface UsersGroupsModelSeq extends Model {
    readonly userId: string;
    readonly groupId: string;
}

export type UsersGroupsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UsersGroupsModelSeq;
};

export const UsersGroupsModel: UsersGroupsModelStatic = <
    UsersGroupsModelStatic
>db.define('UsersGroups', {
    userId: {
        type: DataTypes.UUID
    },
    groupId: {
        type: DataTypes.UUID
    }
});
