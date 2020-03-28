jest.mock('../logging/error-handled');
jest.mock('../services/group.service');
jest.mock('../models/groups.model');
jest.mock('../data-access/group.dao');

import { groupsController } from './groups';
import { getMockRes, fakeGroup } from '../spec-utils/index';
import { Group } from '../interfaces/group.model';
import { SeqUpdateResponse } from '../interfaces/seq-update-response';

describe('Groups controller', () => {
    const mockRes = getMockRes();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call res.json with fetched group on getById call', async () => {
        const mockReq = {
            params: { id: 'fakeId' }
        } as any;

        await groupsController.getById(mockReq, mockRes);

        expect(mockRes.json).toBeCalledWith(fakeGroup);
    });

    test('should call res.json with array of fetched groups on groupsController call', async () => {
        const mockReq = {} as any;

        await groupsController.getAllGroups(mockReq, mockRes);

        expect(mockRes.json).toBeCalledWith([fakeGroup]);
    });

    test('should call res.json with array of fetched groups on postGroup call', async () => {
        const group: Group = {
            name: 'fakeGroup',
            permissions: ['READ']
        };
        const expectedGroup: Group = {
            ...group,
            id: 'fakeId'
        };
        const mockReq = {
            body: group
        } as any;

        await groupsController.postGroup(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(201);
        expect(mockRes.json).toBeCalledWith(expectedGroup);
    });

    test('should call res.status with 200 and res.json with true on successful postAddUsersToGroup call', async () => {
        const mockReq = {
            params: { id: 'fakeGroupId' },
            body: ['fakeUserId1', 'fakeUserId2']
        } as any;
        const expectedResult: boolean = true;

        await groupsController.postAddUsersToGroup(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(200);
        expect(mockRes.json).toBeCalledWith(expectedResult);
    });

    test('should call res.status with 200 and res.json with proper response on successful putGroupById call', async () => {
        const mockReq = {
            params: { id: 'fakeGroupId' },
            body: fakeGroup
        } as any;
        const expectedResult: SeqUpdateResponse<Group> = [1, [fakeGroup]];

        await groupsController.putGroupById(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(200);
        expect(mockRes.json).toBeCalledWith(expectedResult);
    });

    test('should call res.status with 200 on successful deleteGroupById call', async () => {
        const mockReq = {
            params: { id: 'fakeGroupId' }
        } as any;

        await groupsController.deleteGroupById(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(200);
    });
});
