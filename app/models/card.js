const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

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

module.exports = Card;