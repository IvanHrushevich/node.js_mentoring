import { Op } from 'sequelize';

import { User, SeqUpdateResponse } from '../interfaces/index';
import { UsersModelStatic } from '../models/index';

export class UserDAO {
    _usersModel: UsersModelStatic;

    constructor(usersModel: UsersModelStatic) {
        this._usersModel = usersModel;
    }

    async getAllUsers(): Promise<User[]> {
        await this._usersModel.sync();
        return this._usersModel.findAll();
    }

    getFilteredUsers(
        searchStr: string,
        limit: number | undefined
    ): Promise<User[]> {
        return this._usersModel.findAll({
            where: {
                login: { [Op.substring]: searchStr }
            },
            limit
        });
    }

    getUserById(id: string): Promise<User | null> {
        return this._usersModel.findOne({ where: { id } });
    }

    saveUser(user: User): Promise<User> {
        return this._usersModel.create(user);
    }

    updateUser(id: string, reqUser: User): Promise<SeqUpdateResponse<User>> {
        return this._usersModel.update(reqUser, { where: { id } });
    }

    deleteUser(id: string): Promise<number> {
        return this._usersModel.destroy({ where: { id } });
    }
}
