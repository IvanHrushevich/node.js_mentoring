import { GroupsModel, GroupsModelStatic } from './groups.model';
import { UsersModel, UsersModelStatic } from './users.model';
import { db } from './db';

UsersModel.belongsToMany(GroupsModel, { through: 'UsersGroups' });
GroupsModel.belongsToMany(UsersModel, { through: 'UsersGroups' });

db.sync().then(() => console.log('All models were synchronized successfully.'));

export { db, GroupsModel, GroupsModelStatic, UsersModel, UsersModelStatic };
