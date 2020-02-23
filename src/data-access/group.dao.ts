import { Group, SeqUpdateResponse } from '../interfaces/index';
import { GroupsModelStatic, UsersModel, db } from '../models/index';

const includeOption = {
    include: [
        {
            model: UsersModel,
            as: 'users',
            required: false,
            attributes: ['id', 'login'],
            through: { attributes: [] }
        }
    ]
};

export class GroupDAO {
    _groupsModel: GroupsModelStatic;

    constructor(groupsModel: GroupsModelStatic) {
        this._groupsModel = groupsModel;
    }

    getAllGroups(): Promise<Group[]> {
        return this._groupsModel.findAll({ ...includeOption });
    }

    async getGroupById(id: string): Promise<Group | null> {
        let group: Group | null = null;

        try {
            group = await this._groupsModel.findOne({
                ...includeOption,
                where: { id }
            });
        } catch {}

        return group;
    }

    saveGroup(group: Group): Promise<Group> {
        return this._groupsModel.create(group);
    }

    updateGroup(
        id: string,
        reqGroup: Group
    ): Promise<SeqUpdateResponse<Group>> {
        return this._groupsModel.update(reqGroup, { where: { id } });
    }

    deleteGroup(id: string): Promise<number> {
        return this._groupsModel.destroy({ where: { id } });
    }

    async addUsersToGroup(
        groupId: string,
        userIds: string[]
    ): Promise<boolean> {
        try {
            const result = await db.transaction(async t => {
                const group = await this._groupsModel.findOne({
                    where: { id: groupId },
                    transaction: t
                });

                await (<any>group).addUsers(userIds, { transaction: t });

                return true;
            });

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
