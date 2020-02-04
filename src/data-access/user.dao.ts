import { Op } from 'sequelize';

import { User } from '../interfaces/index';

export class UserDAO {
    _userModel;

    constructor(userModel) {
        this._userModel = userModel;
    }

    getAllUsers() {
        return this._userModel.findAll();
    }

    getFilteredUsers(searchStr: string, limit: number) {
        return this._userModel.findAll({
            where: {
                login: { [Op.substring]: searchStr }
            },
            limit
        });
    }

    getUserById(id: string) {
        return this._userModel.findOne({ where: { id } });
    }

    saveUser(user: User) {
        return this._userModel.create(user);
    }

    updateUser(id: string, reqUser: User) {
        const updatedProps: Array<string> = Object.keys(reqUser);

        const updatedUser = updatedProps.reduce((acc: any, prop: string) => {
            acc[prop] = reqUser[prop];
            return acc;
        }, {});

        return this._userModel.update(updatedUser, { where: { id } });
    }

    deleteUser(id: string) {
        return this._userModel.destroy({ where: { id } });
    }
}
