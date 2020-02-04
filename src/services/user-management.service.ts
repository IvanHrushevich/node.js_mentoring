import { userSchema, errorResponse } from '../validation/index';
import { UserDAO } from '../data-access/index';
import { User } from '../interfaces/index';

export class UserManagementService {
    _userDAO: UserDAO;

    constructor(userDAO: UserDAO) {
        this._userDAO = userDAO;
    }

    getUserById(id: string) {
        return this._userDAO.getUserById(id);
    }

    getFilteredUsers(searchStr: string, limit: number) {
        const isRequestForAllUsers =
            searchStr === undefined && limit === undefined;

        return isRequestForAllUsers
            ? this._userDAO.getAllUsers()
            : this._userDAO.getFilteredUsers(searchStr, limit);
    }

    saveUser(user: User) {
        const { error } = userSchema.validate(user, {
            abortEarly: false,
            allowUnknown: false
        });

        let result;

        if (error) {
            result = Promise.reject(errorResponse(error.details));
        } else {
            result = this._userDAO.saveUser(user);
        }

        return result;
    }

    updateUser(id: string, reqUser: User) {
        const { error } = userSchema.validate(reqUser, {
            abortEarly: false,
            allowUnknown: false
        });

        return error
            ? Promise.reject(errorResponse(error.details))
            : this._userDAO.updateUser(id, reqUser);
    }

    deleteUser(id: string) {
        return this._userDAO.deleteUser(id);
    }
}
