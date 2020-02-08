import { GroupDAO } from '../data-access/index';
import { SeqUpdateResponse, Group } from '../interfaces/index';

export class GroupService {
    _groupDAO: GroupDAO;

    constructor(groupDAO: GroupDAO) {
        this._groupDAO = groupDAO;
    }

    getGroupById(id: string): Promise<Group | null> {
        return this._groupDAO.getGroupById(id);
    }

    getAllGroups(): Promise<Group[]> {
        return this._groupDAO.getAllGroups();
    }

    saveGroup(group: Group): Promise<Group> {
        return this._groupDAO.saveGroup(group);
    }

    updateGroup(
        id: string,
        reqGroup: Group
    ): Promise<SeqUpdateResponse<Group>> {
        return this._groupDAO.updateGroup(id, reqGroup);
    }

    deleteGroup(id: string): Promise<number> {
        return this._groupDAO.deleteGroup(id);
    }
}
