// Importation des dépendances
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

// Création de la classe
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

// Exportation de la classe
module.exports = User;