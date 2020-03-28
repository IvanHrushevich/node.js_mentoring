import { Group, SeqUpdateResponse } from '../../interfaces/index';
import { fakeGroup } from '../../spec-utils/index';

export class GroupService {
    getGroupById(): Promise<Group | null> {
        return Promise.resolve(fakeGroup);
    }

    getAllGroups(): Promise<Group[]> {
        return Promise.resolve([fakeGroup]);
    }

    saveGroup(): Promise<Group> {
        return Promise.resolve(fakeGroup);
    }

    updateGroup(): Promise<SeqUpdateResponse<Group>> {
        return Promise.resolve([1, [fakeGroup]]);
    }

    deleteGroup(): Promise<number> {
        return Promise.resolve(1);
    }

    addUsersToGroup(): Promise<boolean> {
        return Promise.resolve(true);
    }
}
