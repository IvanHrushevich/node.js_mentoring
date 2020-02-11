import { Op } from 'sequelize';

import {
    User,
    SeqUpdateResponse,
    UserCreateRequest,
    Group
} from '../interfaces/index';
import { UsersModelStatic, db, GroupsModel } from '../models/index';
import { GroupDAO } from './group.dao';
import { UsersGroupsDAO } from './users-groups.dao';

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
        id: string,
        reqUser: Partial<UserCreateRequest>
    ): Promise<SeqUpdateResponse<User>> {
        // try {
        //     const result: any = await db.transaction(async () => {
        //         //
        //         if (!reqUser.groups) {
        //             return this._usersModel.update(reqUser, { where: { id } });
        //         } else {
        //             const groupsInDb: {
        //                 GroupId: string;
        //             }[] = await this._usersGroupsDAO.getAllUserGroups(id);

        //             const existingGroups: string[] = groupsInDb.map(
        //                 (obj: { GroupId: string }) => obj.GroupId
        //             );

        //             console.log('existingGroups', existingGroups);
        //         }

        //         return result;
        //     });
        // } catch (error) {
        //     return Promise.reject(error);
        // }
        return this._usersModel.update(reqUser, { where: { id } });
    }

    deleteUser(id: string): Promise<number> {
        return this._usersModel.destroy({ where: { id } });
    }
}
