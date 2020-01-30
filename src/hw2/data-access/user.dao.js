export class UserDAO {
    _userModel;

    constructor(userModel) {
        this._userModel = userModel;
    }

    getAllUsers() {
        return this._userModel.getAllUsers();
    }

    getFilteredUsers(searchStr, limit) {
        return this._userModel.getFilteredUsers(searchStr, limit);
    }

    getUserById(id) {
        return this._userModel.getUserById(id);
    }

    saveUser(user) {
        return this._userModel.saveUser(user);
    }

    updateUser(id, reqUser) {
        return this._userModel.updateUser(id, reqUser);
    }

    deleteUser(id) {
        return this._userModel.deleteUser(id);
    }
}
