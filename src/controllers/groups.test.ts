jest.mock('../logging/error-handled');
jest.mock('../services/group.service');
jest.mock('../services/auth.service');

import { groupsController } from './groups';
import { getMockRes, fakeGroup } from '../spec-utils/index';

describe('Groups controller', () => {
    test('should call res.json with fetched group', async () => {
        const mockReq = {
            params: { id: 'fakeId' }
        } as any;
        const mockRes = getMockRes();

        await groupsController.getById(mockReq, mockRes);

        expect(mockRes.json).toBeCalledWith(fakeGroup);
    });
});
