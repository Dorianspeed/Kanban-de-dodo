const { Datatypes, Model } = require('sequelize');
const sequelize = require('../database');

class Table extends Model {};

Table.init({
    name: Datatypes.TEXT,
    background_color: Datatypes.TEXT    
}, {
    sequelize,
    tableName: "table"
});

module.exports = Table;