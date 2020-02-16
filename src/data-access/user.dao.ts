import { Op } from 'sequelize';

import { User, UserCreateRequest, Group } from '../interfaces/index';
import { UsersModelStatic, db, GroupsModel } from '../models/index';
import { GroupDAO } from './group.dao';

interface ObjectWithMathedProps {
    [key: string]: boolean;
}

const includeOption = {
    include: [
        {
            model: GroupsModel,
            as: 'groups',
            required: false,
            through: { attributes: [] }
        }
    ]
};

export class UserDAO {
    _usersModel: UsersModelStatic;
    _groupDao: GroupDAO;

    constructor(usersModel: UsersModelStatic, groupDao: GroupDAO) {
        this._usersModel = usersModel;
        this._groupDao = groupDao;
    }

    getAllUsers(): Promise<User[]> {
        return this._usersModel.findAll({ ...includeOption });
    }

    getFilteredUsers(
        searchStr: string,
        limit: number | undefined
    ): Promise<User[]> {
        return this._usersModel.findAll({
            ...includeOption,
            where: {
                login: { [Op.substring]: searchStr }
            },
            limit
        });
    }

    getUserById(id: string): Promise<User | null> {
        return this._usersModel.findOne({ ...includeOption, where: { id } });
    }

    async saveUser(reqUser: UserCreateRequest): Promise<User> {
        const { login, password, age } = reqUser;
        const groupIds: string[] = reqUser.groups;

        const user: User = {
            login,
            password,
            age
        };

        try {
            const result = await db.transaction(async t => {
                const savedUser: User = await this._usersModel.create(user, {
                    transaction: t
                });

                for (let groupId of groupIds) {
                    const foundGroup: Group | null = await this._groupDao.getGroupById(
                        groupId
                    );

                    if (!foundGroup) {
                        throw 'No such group';
                    }

                    // sequelize types
                    await (<any>savedUser).addGroups(groupId, {
                        transaction: t
                    });
                }

                return savedUser;
            });

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async updateUser(
        id: string,
        reqUser: Partial<UserCreateRequest>
    ): Promise<any> {
        try {
            const result: any = await db.transaction(async t => {
                const userUpdateResult = await this._usersModel.update(
                    reqUser,
                    {
                        where: { id },
                        transaction: t
                    }
                );
                if (reqUser.groups) {
                    const user = await this._usersModel.findOne({
                        where: { id },
                        transaction: t
                    });

                    // sequelize types
                    await (<any>user).setGroups(reqUser.groups, {
                        transaction: t
                    });
                }

                return userUpdateResult;
            });

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async deleteUser(id: string): Promise<number> {
        try {
            const result = await db.transaction(async t => {
                const user = await this._usersModel.findOne({
                    where: { id },
                    transaction: t
                });

                // sequelize types
                await (<any>user).setGroups([], {
                    transaction: t
                });

                const deleteResult = await this._usersModel.destroy({
                    where: { id },
                    transaction: t
                });

                return deleteResult;
            });

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
