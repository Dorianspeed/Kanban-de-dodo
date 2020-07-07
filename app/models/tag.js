// Importation des dépendances
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

// Création de la classe
class Tag extends Model {};

Tag.init({
    name: DataTypes.TEXT,
    background_color: DataTypes.TEXT,
    text_color: DataTypes.TEXT
}, {
    sequelize,
    tableName: "tag"
});

// Exportation de la classe
module.exports = Tag;