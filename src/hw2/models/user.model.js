import { Sequelize } from 'sequelize';

import { db } from './index';

const Op = Sequelize.Op;

export class UserModel {
    User;

    constructor() {
        this._connectToDb();
    }

    getAllUsers() {
        return this.User.findAll();
    }

    getFilteredUsers(searchStr, limit) {
        return this.User.findAll({
            where: {
                login: { [Op.substring]: searchStr }
            },
            limit
        });
    }

    getUserById(id) {
        return this.User.findOne({ where: { id } });
    }

    saveUser(user) {
        return this.User.create(user);
    }

    updateUser(id, reqUser) {
        const updatedProps = Object.keys(reqUser);

        const updatedUser = updatedProps.reduce((acc, prop) => {
            acc[prop] = reqUser[prop];
            return acc;
        }, {});

        return this.User.update(updatedUser, { where: { id } });
    }

    deleteUser(id) {
        return this.User.update({ isDeleted: true }, { where: { id } });
    }

    _connectToDb() {
        this.User = db.define('user', {
            login: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }
        });
    }
}
