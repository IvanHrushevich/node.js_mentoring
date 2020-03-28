jest.mock('../logging/error-handled');
jest.mock('../services/auth.service');

import express from 'express';

import { authController } from './auth';

describe('Auth controller', () => {
    test('should call res.status with 200 and res.json with token on postLogin call', async () => {
        const mockReq = {
            body: {
                login: 'testLogin',
                password: 'testPassword'
            }
        } as express.Request;
        const getMockRes = () => {
            const res: any = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const mockRes = getMockRes();

        await authController.postLogin(mockReq, mockRes);

        expect(mockRes.status).toBeCalledWith(200);
        expect(mockRes.json).toBeCalledWith({ token: 'fakeToken' });
    });
});
