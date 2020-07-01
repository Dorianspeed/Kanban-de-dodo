const User = require('./user');
const Table = require('./table');
const List = require('./list');
const Card = require('./card');
const Tag = require('./tag');


// Associations pour la class User
User.hasMany(Table, {
    foreignKey: 'user_id',
    as: 'tables'
});

Table.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(List, {
    foreignKey: 'user_id',
    as: 'lists'
});

List.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(Card, {
    foreignKey: 'user_id',
    as: 'cards'
});

Card.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(Tag, {
    foreignKey: 'user_id',
    as: 'tags'
});

Tag.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});


// Associations pour la class Table
Table.hasMany(List, {
    foreignKey: 'table_id',
    as: 'lists'
});

List.belongsTo(Table, {
    foreignKey: 'table_id',
    as: 'table'
});


// Associations pour la class List
List.hasMany(Card, {
    foreignKey: 'list_id',
    as: 'cards'
});

Card.belongsTo(List, {
    foreignKey: 'list_id',
    as: 'list'
});


// Associations sur la relation Card <--> Tag
Card.belongsToMany(Tag, {
    through: 'card_has_tag',
    foreignKey: 'card_id',
    otherKey: 'tag_id',
    as: 'tags',
    timestamps: false
});

Tag.belongsToMany(Card, {
    through: 'card_has_tag',
    foreignKey: 'tag_id',
    otherKey: 'card_id',
    as: 'cards',
    timestamps: false
});

module.exports = { User, Table, List, Card, Tag };