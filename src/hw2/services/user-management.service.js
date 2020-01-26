import uuid from 'uuid/v1';

import { userSchema, errorResponse } from '../validation/index';

export class UserManagementService {
    users = {};

    getUserById(id) {
        const user = this.users[id];
        return user && user.isDeleted === false ? user : undefined;
    }

    getFilteredUsers(searchStr, limit) {
        const isRequestForAllUsers =
            searchStr === undefined && limit === undefined;

        const activeUsers = Object.values(this.users).filter(
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
    }

    saveUser(user) {
        const { error } = userSchema.validate(user, {
            abortEarly: false,
            allowUnknown: false
        });

        let result;

        if (error) {
            result = { error: errorResponse(error.details) };
        } else {
            const id = uuid();
            user.id = id;
            user.isDeleted = false;
            this.users[user.id] = user;

            result = user;
        }

        return result;
    }

    updateUser(id, reqUser) {
        const { error } = userSchema.validate(reqUser, {
            abortEarly: false,
            allowUnknown: false
        });

        let result;
        if (error) {
            result = {
                error: {
                    validation: errorResponse(error.details)
                }
            };
        } else {
            const user = this.users[id];

            if (user && user.isDeleted === false) {
                const updatedUser = {
                    ...user,
                    ...reqUser
                };
                this.users[id] = updatedUser;

                result = updatedUser;
            } else {
                result = {
                    error: {
                        noUser: true
                    }
                };
            }
        }

        return result;
    }

    deleteUser(id) {
        const user = this.users[id];

        let result;

        if (user && user.isDeleted === false) {
            user.isDeleted = true;

            result = user;
        }

        return result;
    }

    _getAutoSuggestUsers(userList, searchStr, limitString) {
        let limit = Number(limitString);

        if (limit < 1) {
            limit = undefined;
        }

        if (searchStr) {
            userList = userList.filter(user => user.login.includes(searchStr));
        }

        return userList.sort(this._sortUsers).slice(0, limit);
    }

    _sortUsers(user1, user2) {
        return user1.login > user2.login ? 1 : -1;
    }
}
