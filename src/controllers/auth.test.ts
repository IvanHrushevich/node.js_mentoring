import { authRouter } from './auth';

describe('Auth controller', () => {
    test('adds 1 + 2 to equal 3', () => {
        console.log('authRouter', authRouter);
        expect(1 + 2).toBe(3);
    });
});
