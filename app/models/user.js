const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class User extends Model {};

User.init({
    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,
    email: DataTypes.TEXT,
    password: DataTypes.TEXT
}, {
    sequelize,
    tableName: "user"
});

module.exports = User;