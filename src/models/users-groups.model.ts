import { DataTypes, Model, BuildOptions } from 'sequelize';

import { db } from './db';
import { UsersModel } from './users.model';
import { GroupsModel } from './groups.model';

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
        type: DataTypes.UUID,
        references: {
            model: UsersModel
        }
    },
    GroupId: {
        type: DataTypes.UUID,
        references: {
            model: GroupsModel
        }
    }
});
