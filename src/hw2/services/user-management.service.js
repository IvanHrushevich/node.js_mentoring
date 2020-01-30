import { userSchema, errorResponse } from '../validation/index';
import { UserDAO } from '../data-access/index';
import { UserModel } from '../models/index';

class UserManagementService {
    constructor(userDAO) {
        this._userDAO = userDAO;
    }

    getUserById(id) {
        return this._userDAO
            .getUserById(id)
            .then(user =>
                user && user.isDeleted === false ? user : undefined
            );
    }

    getFilteredUsers(searchStr, limit) {
        const isRequestForAllUsers =
            searchStr === undefined && limit === undefined;

        if (isRequestForAllUsers) {
            return this._userDAO.getAllUsers();
        } else {
            return this._userDAO.getFilteredUsers(searchStr, limit);
        }
    }

    saveUser(user) {
        const { error } = userSchema.validate(user, {
            abortEarly: false,
            allowUnknown: false
        });

        let result;

        if (error) {
            result = Promise.reject(errorResponse(error.details));
        } else {
            user.isDeleted = false;
            result = this._userDAO.saveUser(user);
        }

        return result;
    }

    updateUser(id, reqUser) {
        const { error } = userSchema.validate(reqUser, {
            abortEarly: false,
            allowUnknown: false
        });

        return error
            ? Promise.reject(errorResponse(error.details))
            : this._userDAO.updateUser(id, reqUser);
    }

    deleteUser(id) {
        return this._userDAO.deleteUser(id);
    }

    _getAutoSuggestUsers(userList, searchStr, limitString) {
        let limit = Number(limitString);

        if (limit < 1) {
            limit = undefined;
        }

        if (searchStr) {
            userList = userList.filter(user => user.login.includes(searchStr));
        }

        return limit
            ? userList.sort(this._sortUsers).slice(0, limit)
            : userList.sort(this._sortUsers);
    }

    _sortUsers(user1, user2) {
        return user1.login > user2.login ? 1 : -1;
    }
}

export const userManagementService = new UserManagementService(
    new UserDAO(new UserModel())
);
