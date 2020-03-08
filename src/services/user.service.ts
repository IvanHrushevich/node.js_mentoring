import { ValidationResult } from '@hapi/joi';

import { userSchema, errorResponse } from '../validation/index';
import { UserDAO } from '../data-access/index';
import {
    User,
    SeqUpdateResponse,
    UserCreateRequest
} from '../interfaces/index';

export class UserService {
    _userDAO: UserDAO;

    constructor(userDAO: UserDAO) {
        this._userDAO = userDAO;
    }

    getUserById(id: string): Promise<User | null> {
        return this._userDAO.getUserById(id);
    }

    getUserByName(name: string): Promise<User | null> {
        return this._userDAO.getUserByName(name);
    }

    getFilteredUsers(
        searchStr: string,
        limit: number | undefined
    ): Promise<User[]> {
        const isRequestForAllUsers =
            searchStr === undefined && limit === undefined;

        return isRequestForAllUsers
            ? this._userDAO.getAllUsers()
            : this._userDAO.getFilteredUsers(searchStr, limit);
    }

    saveUser(user: UserCreateRequest): Promise<User> {
        const validationResult: ValidationResult = userSchema.validate(user, {
            abortEarly: false,
            allowUnknown: false
        });
        const error = validationResult.error;

        let result;

        if (error) {
            result = Promise.reject(errorResponse(error.details));
        } else {
            result = this._userDAO.saveUser(user);
        }

        return result;
    }

    updateUser(id: string, reqUser: User): Promise<SeqUpdateResponse<User>> {
        return this._userDAO.updateUser(id, reqUser);
    }

    deleteUser(id: string): Promise<number> {
        return this._userDAO.deleteUser(id);
    }
}
