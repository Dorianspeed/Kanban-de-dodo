const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Table extends Model {};

Table.init({
    name: DataTypes.TEXT,
    background_color: DataTypes.TEXT    
}, {
    sequelize,
    tableName: "table"
});

module.exports = Table;