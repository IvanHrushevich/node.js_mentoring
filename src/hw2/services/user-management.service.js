import { userSchema, errorResponse } from '../validation/index';
import { UserModel } from '../data-access/index';

class UserManagementService {
    constructor(userModel) {
        this.userModel = userModel;
    }

    getUserById(id) {
        return this.userModel
            .getUserById(id)
            .then(user =>
                user && user.isDeleted === false ? user : undefined
            );
    }

    getFilteredUsers(searchStr, limit) {
        const isRequestForAllUsers =
            searchStr === undefined && limit === undefined;

        return this.userModel.getAllUsers().then(users => {
            const activeUsers = Object.values(users).filter(
                user => user.isDeleted === false
            );

            const filteredUserList = isRequestForAllUsers
                ? activeUsers.sort(this._sortUsers)
                : this._getAutoSuggestUsers(activeUsers, searchStr, limit);

            let filteredUsers;

            if (filteredUserList.length) {
                filteredUsers = filteredUserList.reduce((acc, curr) => {
                    acc[curr.id] = curr;
                    return acc;
                }, {});
            }

            return filteredUsers;
        });
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
            result = this.userModel.saveUser(user);
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
            : this.userModel.updateUser(id, reqUser);
    }

    deleteUser(id) {
        return this.userModel.deleteUser(id);
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

export const userManagementService = new UserManagementService(new UserModel());
