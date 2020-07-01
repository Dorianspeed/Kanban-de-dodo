const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Tag extends Model {};

Tag.init({
    name: DataTypes.TEXT,
    background_color: DataTypes.TEXT,
    text_color: DataTypes.TEXT
}, {
    sequelize,
    tableName: "tag"
});

module.exports = Tag;