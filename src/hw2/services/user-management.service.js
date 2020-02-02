import { userSchema, errorResponse } from '../validation/index';

export class UserManagementService {
    constructor(userDAO) {
        this._userDAO = userDAO;
    }

    async getUserById(id) {
        const user = await this._userDAO.getUserById(id);

        return user && user.isDeleted === false ? user : undefined;
    }

    getFilteredUsers(searchStr, limit) {
        const isRequestForAllUsers =
            searchStr === undefined && limit === undefined;

        return isRequestForAllUsers
            ? this._userDAO.getAllUsers()
            : this._userDAO.getFilteredUsers(searchStr, limit);
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
}
