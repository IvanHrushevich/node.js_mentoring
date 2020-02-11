import { GroupsModel, GroupsModelStatic } from './groups.model';
import { UsersModel, UsersModelStatic } from './users.model';
import { UsersGroupsModel, UsersGroupsModelStatic } from './users-groups.model';
import { db } from './db';

UsersModel.belongsToMany(GroupsModel, { through: UsersGroupsModel });
GroupsModel.belongsToMany(UsersModel, { through: UsersGroupsModel });

db.sync().then(() => console.log('All models were synchronized successfully.'));

export {
    db,
    GroupsModel,
    GroupsModelStatic,
    UsersModel,
    UsersModelStatic,
    UsersGroupsModel,
    UsersGroupsModelStatic
};
