const { Datatypes, Model } = require('sequelize');
const sequelize = require('../database');

class Tag extends Model {};

Tag.init({
    name: Datatypes.TEXT,
    background_color: Datatypes.TEXT,
    text_color: Datatypes.TEXT
}, {
    sequelize,
    tableName: "tag"
});

module.exports = Tag;