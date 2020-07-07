// Importation des dépendances
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

// Création de la classe
class Card extends Model {};

Card.init({
    name: DataTypes.TEXT,
    position: DataTypes.INTEGER,
    background_color: DataTypes.TEXT,
    text_color: DataTypes.TEXT
}, {
    sequelize,
    tableName: "card"
});

// Exportation de la classe
module.exports = Card;