import { fakeUser } from './../../spec-utils/index';
import { User, SeqUpdateResponse } from '../../interfaces/index';

export class UserService {
    getUserById(id: string): Promise<User | null> {
        return id === 'fakeId'
            ? Promise.resolve(fakeUser)
            : Promise.resolve(null);
    }

    getUserByName(name: string): Promise<User | null> {
        return name === 'fakeName'
            ? Promise.resolve(fakeUser)
            : Promise.resolve(null);
    }

    getFilteredUsers(): Promise<User[]> {
        return Promise.resolve([fakeUser]);
    }

    saveUser(): Promise<User> {
        return Promise.resolve(fakeUser);
    }

    updateUser(): Promise<SeqUpdateResponse<User>> {
        return Promise.resolve([1, [fakeUser]]);
    }

    deleteUser(): Promise<number> {
        return Promise.resolve(1);
    }
}
