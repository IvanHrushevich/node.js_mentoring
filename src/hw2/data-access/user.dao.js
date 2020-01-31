import { Sequelize } from 'sequelize';

const Op = Sequelize.Op;

export class UserDAO {
    _userModel;
    _synced = false;

    constructor(userModel) {
        this._userModel = userModel;
    }

    getAllUsers() {
        return this._userModel.sync().then(() => {
            return this._userModel.findAll();
        });
    }

    getFilteredUsers(searchStr, limit) {
        return this._userModel.findAll({
            where: {
                login: { [Op.substring]: searchStr }
            },
            limit
        });
    }

    getUserById(id) {
        return this._userModel.findOne({ where: { id } });
    }

    saveUser(user) {
        return this._userModel.create(user);
    }

    updateUser(id, reqUser) {
        const updatedProps = Object.keys(reqUser);

        const updatedUser = updatedProps.reduce((acc, prop) => {
            acc[prop] = reqUser[prop];
            return acc;
        }, {});

        return this._userModel.update(updatedUser, { where: { id } });
    }

    deleteUser(id) {
        return this._userModel.update({ isDeleted: true }, { where: { id } });
    }
}
