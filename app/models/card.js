const { Datatypes, Model } = require('sequelize');
const sequelize = require('../database');

class Card extends Model {};

Card.init({
    name: Datatypes.TEXT,
    position: Datatypes.INTEGER,
    background_color: Datatypes.TEXT,
    text_color: Datatypes.TEXT
}, {
    sequelize,
    tableName: "card"
});

module.exports = Card;