const { Datatypes, Model } = require('sequelize');
const sequelize = require('../database');

class List extends Model {};

List.init({
    name: Datatypes.TEXT,
    position: Datatypes.INTEGER
}, {
    sequelize,
    tableName: "list"
});

module.exports = List;