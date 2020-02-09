import { DataTypes, Model, BuildOptions } from 'sequelize';

import { Permission } from '../interfaces/index';
import { db } from './db';

interface GroupModelSeq extends Model {
    readonly id: string;
    readonly name: string;
    readonly permissions: Permission[];
}

export type GroupModelStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): GroupModelSeq;
};

const GroupModel: GroupModelStatic = <GroupModelStatic>db.define('group', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
});

export { GroupModel };
