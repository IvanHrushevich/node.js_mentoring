import { GroupsModel, GroupsModelStatic } from './groups.model';
import { UsersModel, UsersModelStatic } from './users.model';
import { db } from './db';

db.sync().then(() => console.log('All models were synchronized successfully.'));

UsersModel.belongsToMany(GroupsModel, {
    through: 'UserGroup',
    as: 'groups'
});

GroupsModel.belongsToMany(UsersModel, {
    through: 'UserGroup',
    as: 'users'
});

export { db, GroupsModel, GroupsModelStatic, UsersModel, UsersModelStatic };

// request body examples

// {
// 	"login": "Alex",
// 	"age": 22,
// 	"password": "asdAsd123",
// 	"groups": ["77f947cb-c327-4569-9393-a8dbe588fe94", "8ef91029-5c1e-45bf-a761-3858190354b0"]
// }

// {
//     "name": "superadmin",
//     "permissions": ["Read", "Write"]
// }
