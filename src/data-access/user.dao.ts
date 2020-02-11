import { Op } from 'sequelize';

import {
    User,
    SeqUpdateResponse,
    UserCreateRequest,
    Group
} from '../interfaces/index';
import { UsersModelStatic, db } from '../models/index';
import { GroupDAO } from './group.dao';
import { UsersGroupsDAO } from './users-groups.dao';

export class UserDAO {
    _usersModel: UsersModelStatic;
    _groupDao: GroupDAO;
    _usersGroupsDAO: UsersGroupsDAO;

    constructor(
        usersModel: UsersModelStatic,
        groupDao: GroupDAO,
        usersGroupsDAO: UsersGroupsDAO
    ) {
        this._usersModel = usersModel;
        this._groupDao = groupDao;
        this._usersGroupsDAO = usersGroupsDAO;
    }

    getAllUsers(): Promise<User[]> {
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

    async saveUser(reqUser: UserCreateRequest): Promise<User> {
        const { login, password, age, groups } = reqUser;

        const user: User = {
            login,
            password,
            age
        };

        try {
            const result = await db.transaction(async () => {
                const savedUser: User = await this._usersModel.create(user);

                for (let group of groups) {
                    const foundGroup: Group | null = await this._groupDao.getGroupByName(
                        group
                    );

                    if (!foundGroup) {
                        throw 'No such group';
                    }

                    const savedUserGroup = this._usersGroupsDAO.saveUserGroup(
                        <string>savedUser.id,
                        foundGroup.id
                    );
                }

                return savedUser;
            });

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    updateUser(id: string, reqUser: User): Promise<SeqUpdateResponse<User>> {
        return this._usersModel.update(reqUser, { where: { id } });
    }

    deleteUser(id: string): Promise<number> {
        return this._usersModel.destroy({ where: { id } });
    }
}
