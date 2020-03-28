jest.mock('../logging/error-handled');
jest.mock('../services/group.service');
jest.mock('../models/groups.model');
jest.mock('../data-access/group.dao');

import { groupsController } from './groups';
import { getMockRes, fakeGroup } from '../spec-utils/index';
import { Group } from '../interfaces/group.model';

describe('Groups controller', () => {
    test('should call res.json with fetched group on getById call', async () => {
        const mockReq = {
            params: { id: 'fakeId' }
        } as any;
        const mockRes = getMockRes();

        await groupsController.getById(mockReq, mockRes);

        expect(mockRes.json).toBeCalledWith(fakeGroup);
    });

    test('should call res.json with array of fetched groups on groupsController call', async () => {
        const mockReq = {} as any;
        const mockRes = getMockRes();

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
        const mockRes = getMockRes();

        await groupsController.postGroup(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(201);
        expect(mockRes.json).toBeCalledWith(expectedGroup);
    });
});
