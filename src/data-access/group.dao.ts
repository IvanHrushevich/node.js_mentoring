import { Group, SeqUpdateResponse } from '../interfaces/index';
import { GroupsModelStatic } from '../models/index';

export class GroupDAO {
    _groupsModel: GroupsModelStatic;

    constructor(groupsModel: GroupsModelStatic) {
        this._groupsModel = groupsModel;
    }

    getAllGroups(): Promise<Group[]> {
        return this._groupsModel.findAll();
    }

    getGroupById(id: string): Promise<Group | null> {
        return this._groupsModel.findOne({ where: { id } });
    }

    getGroupByName(name: string): Promise<Group | null> {
        return this._groupsModel.findOne({ where: { name } });
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
}
