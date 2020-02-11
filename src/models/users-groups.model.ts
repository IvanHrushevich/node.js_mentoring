import { DataTypes, Model, BuildOptions } from 'sequelize';

import { db } from './db';

interface UsersGroupsModelSeq extends Model {
    readonly UserId: string;
    readonly GroupId: string;
}

export type UsersGroupsModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UsersGroupsModelSeq;
};

export const UsersGroupsModel: UsersGroupsModelStatic = <
    UsersGroupsModelStatic
>db.define('UsersGroups', {
    UserId: {
        type: DataTypes.UUID
    },
    GroupId: {
        type: DataTypes.UUID
    }
});
