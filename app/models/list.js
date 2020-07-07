// Importation des dépendances
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

// Création de la classe
class List extends Model {};

List.init({
    name: DataTypes.TEXT,
    position: DataTypes.INTEGER
}, {
    sequelize,
    tableName: "list"
});

// Exportation de la classe
module.exports = List;