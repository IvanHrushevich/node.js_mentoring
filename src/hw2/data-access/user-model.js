import { Sequelize } from 'sequelize';

const Op = Sequelize.Op;

export class UserModel {
    User;

    constructor() {
        this._initConnection();
    }

    getAllUsers() {
        return this.User.sync().then(() => {
            return this.User.findAll();
        });
    }

    getFilteredUsers(searchStr, limit) {
        return this.User.sync().then(() => {
            return this.User.findAll({
                where: {
                    login: { [Op.substring]: searchStr }
                },
                limit
            });
        });
    }

    getUserById(id) {
        return this.User.sync().then(() => {
            return this.User.findOne({ where: { id } });
        });
    }

    saveUser(user) {
        return this.User.sync().then(() => {
            return this.User.create(user);
        });
    }

    updateUser(id, reqUser) {
        const updatedProps = Object.keys(reqUser);

        const updatedUser = updatedProps.reduce((acc, prop) => {
            acc[prop] = reqUser[prop];
            return acc;
        }, {});

        return this.User.sync().then(() => {
            return this.User.update(updatedUser, { where: { id } });
        });
    }

    deleteUser(id) {
        return this.User.sync().then(() => {
            return this.User.update({ isDeleted: true }, { where: { id } });
        });
    }

    _initConnection() {
        const connectionURI =
            'postgres://bbyhlqwvihzmju:1cfe04e8c8c489e71fbb9d63b44a8039af06add5289106f0d1518e4efa27b978@ec2-54-228-237-40.eu-west-1.compute.amazonaws.com:5432/dd9jsqdcncjd1t';

        const sequelize = new Sequelize(connectionURI, {
            dialect: 'postgres',
            dialectOptions: {
                ssl: true
            },
            define: {
                timestamps: false
            }
        });

        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });

        this.User = sequelize.define('user', {
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
