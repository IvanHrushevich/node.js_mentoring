import { GroupsModel, GroupsModelStatic } from './groups.model';
import { UsersModel, UsersModelStatic } from './users.model';
import { db } from './db';
import { UsersGroupsModel, UsersGroupsModelStatic } from './users-groups.model';

db.sync().then(() => console.log('All models were synchronized successfully.'));

UsersModel.belongsToMany(GroupsModel, {
    through: UsersGroupsModel,
    as: 'groups'
});
GroupsModel.belongsToMany(UsersModel, {
    through: UsersGroupsModel,
    as: 'users'
});

export {
    db,
    GroupsModel,
    GroupsModelStatic,
    UsersModel,
    UsersModelStatic,
    UsersGroupsModel,
    UsersGroupsModelStatic
};

// {
// 	"login": "Kate",
// 	"age": 22,
// 	"password": "asdAsd123",
// 	"groups": ["ffeaa016-989f-4a6c-9fdb-89a07b9385c0"]
// }

// {
//     "name": "superadmin",
//     "permissions": ["Read", "Write"]
// }
