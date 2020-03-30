jest.mock('../logging/error-handled');
jest.mock('../services/user.service');
jest.mock('../models/users.model');
jest.mock('../data-access/user.dao');
jest.mock('../data-access/group.dao');

import { usersController } from './users';
import { getMockRes, fakeUser } from '../spec-utils/index';
import { User, SeqUpdateResponse } from '../interfaces';

describe('UsersController', () => {
    const mockRes = getMockRes();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call res.json with fetched user on getById call', async () => {
        const mockReq = {
            params: { id: 'fakeId' }
        } as any;

        await usersController.getById(mockReq, mockRes);

        expect(mockRes.json).toBeCalledWith(fakeUser);
    });

    test('should call res.json with fetched users on getUsers call', async () => {
        const mockReq = {
            query: {}
        } as any;

        await usersController.getUsers(mockReq, mockRes);

        expect(mockRes.json).toBeCalledWith([fakeUser]);
    });

    test('should call res.status with 201 and res.json with saved user on successful postUser call', async () => {
        const user: User = fakeUser;
        delete user.id;
        const mockReq = {
            query: {},
            body: user
        } as any;

        await usersController.postUser(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(201);
        expect(mockRes.json).toBeCalledWith(fakeUser);
    });

    test('should call res.status with 200 and res.json with proper response on successful putUserById call', async () => {
        const user: User = fakeUser;
        delete user.id;
        const mockReq = {
            params: { id: 'fakeId' },
            body: user
        } as any;
        const expectedResult: SeqUpdateResponse<User> = [1, [fakeUser]];

        await usersController.putUserById(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(200);
        expect(mockRes.json).toBeCalledWith(expectedResult);
    });

    test('should call res.status with 200 and res.json with proper response on successful deleteUserById call', async () => {
        const mockReq = {
            params: { id: 'fakeId' }
        } as any;
        const expectedResult: number = 1;

        await usersController.deleteUserById(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(200);
        expect(mockRes.json).toBeCalledWith(expectedResult);
    });
});
