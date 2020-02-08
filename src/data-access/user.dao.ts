import { Op } from 'sequelize';

import { User, SeqUpdateResponse } from '../interfaces/index';
import { UserModelStatic } from '../models/index';

export class UserDAO {
    _userModel: UserModelStatic;

    constructor(userModel: UserModelStatic) {
        this._userModel = userModel;
    }

    getAllUsers(): Promise<User[]> {
        return this._userModel.findAll();
    }

    getFilteredUsers(
        searchStr: string,
        limit: number | undefined
    ): Promise<User[]> {
        return this._userModel.findAll({
            where: {
                login: { [Op.substring]: searchStr }
            },
            limit
        });
    }

    getUserById(id: string): Promise<User | null> {
        return this._userModel.findOne({ where: { id } });
    }

    saveUser(user: User): Promise<User> {
        return this._userModel.create(user);
    }

    updateUser(id: string, reqUser: User): Promise<SeqUpdateResponse<User>> {
        return this._userModel.update(reqUser, { where: { id } });
    }

    deleteUser(id: string): Promise<number> {
        return this._userModel.destroy({ where: { id } });
    }
}
