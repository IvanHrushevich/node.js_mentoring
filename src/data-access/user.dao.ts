import { Op } from 'sequelize';

import { User, UserCreateRequest, Group } from '../interfaces/index';
import { UsersModelStatic, db, GroupsModel } from '../models/index';
import { GroupDAO } from './group.dao';
import { UsersGroupsDAO } from './users-groups.dao';

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
            const result = await db.transaction(async () => {
                const savedUser: User = await this._usersModel.create(user);

                for (let groupId of groupIds) {
                    const foundGroup: Group | null = await this._groupDao.getGroupById(
                        groupId
                    );

                    if (!foundGroup) {
                        throw 'No such group';
                    }

                    await this._usersGroupsDAO.saveUserGroup(
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

    async updateUser(
        userId: string,
        reqUser: Partial<UserCreateRequest>
    ): Promise<any> {
        try {
            const result: any = await db.transaction(async () => {
                if (!reqUser.groups) {
                    return this._usersModel.update(reqUser, {
                        where: { id: userId }
                    });
                } else {
                    const groupsInDb: {
                        GroupId: string;
                    }[] = await this._usersGroupsDAO.getAllUserGroups(userId);

                    const existingGroups: ObjectWithMathedProps = groupsInDb
                        .map((obj: { GroupId: string }) => obj.GroupId)
                        .reduce((acc: ObjectWithMathedProps, curr: string) => {
                            acc[curr] = false;
                            return acc;
                        }, {});

                    for (let groupId of reqUser.groups) {
                        if (groupId in existingGroups) {
                            existingGroups[groupId] = true;
                        } else {
                            await this._usersGroupsDAO.saveUserGroup(
                                userId,
                                groupId
                            );
                        }
                    }

                    for (let groupId in existingGroups) {
                        if (!existingGroups[groupId]) {
                            await this._usersGroupsDAO.deleteUserGroup(
                                userId,
                                groupId
                            );
                        }
                    }
                }

                return result;
            });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async deleteUser(id: string): Promise<number> {
        try {
            const result = await db.transaction(async () => {
                await this._usersGroupsDAO.deleteUserGroup(id);
                const response = await this._usersModel.destroy({
                    where: { id }
                });

                return response;
            });

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
