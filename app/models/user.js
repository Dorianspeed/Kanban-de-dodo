const { Datatypes, Model } = require('sequelize');
const sequelize = require('../database');

class User extends Model {};

User.init({
    first_name: Datatypes.TEXT,
    last_name: Datatypes.TEXT,
    email: Datatypes.TEXT,
    password: Datatypes.TEXT
}, {
    sequelize,
    tableName: "user"
});

module.exports = User;