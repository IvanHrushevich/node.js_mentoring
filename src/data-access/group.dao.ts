import { Group, SeqUpdateResponse } from '../interfaces/index';
import { GroupModelStatic } from '../models/index';

export class GroupDAO {
    _groupModel: GroupModelStatic;

    constructor(groupModel: GroupModelStatic) {
        this._groupModel = groupModel;
    }

    async getAllGroups(): Promise<Group[]> {
        await this._groupModel.sync();
        return this._groupModel.findAll();
    }

    getGroupById(id: string): Promise<Group | null> {
        return this._groupModel.findOne({ where: { id } });
    }

    saveGroup(group: Group): Promise<Group> {
        return this._groupModel.create(group);
    }

    updateGroup(
        id: string,
        reqGroup: Group
    ): Promise<SeqUpdateResponse<Group>> {
        return this._groupModel.update(reqGroup, { where: { id } });
    }

    deleteGroup(id: string): Promise<number> {
        return this._groupModel.destroy({ where: { id } });
    }
}
