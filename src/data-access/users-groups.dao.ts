import { UsersGroupsModelStatic } from '../models/index';
import { UserGroup } from '../interfaces/index';

export class UsersGroupsDAO {
    _usersGroupsModel: UsersGroupsModelStatic;

    constructor(usersGroupsModel: UsersGroupsModelStatic) {
        this._usersGroupsModel = usersGroupsModel;
    }

    saveUserGroup(userId: string, groupId: string): Promise<UserGroup> {
        const userGroup: UserGroup = {
            UserId: userId,
            GroupId: groupId
        };

        return this._usersGroupsModel.create(userGroup);
    }

    getAllUserGroups(userId: string): Promise<any> {
        return this._usersGroupsModel.findAll({
            where: { UserId: userId },
            attributes: ['GroupId'],
            raw: true
        });
    }
}
