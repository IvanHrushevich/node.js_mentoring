export class AuthService {
    async authenticate(): Promise<{ token: string }> {
        return Promise.resolve({ token: 'fakeToken' });
    }
}
