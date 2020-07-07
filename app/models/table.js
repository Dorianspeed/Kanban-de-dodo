// Importation des dépendances
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

// Création de classe
class Table extends Model {};

Table.init({
    name: DataTypes.TEXT,
    background_color: DataTypes.TEXT    
}, {
    sequelize,
    tableName: "table"
});

// Exportation de la classe
module.exports = Table;