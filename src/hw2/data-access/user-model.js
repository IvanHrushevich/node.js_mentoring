import { Sequelize } from 'sequelize';

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

    createUser(user) {
        return this.User.sync().then(() => {
            return this.User.create(user);
        });
    }

    deleteUser(id) {
        return this.User.sync().then(() => {
            return this.User.destroy({
                where: { id }
            });
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
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }
        });
    }
}
