const { User, Table, List, Card, Tag } = require('../models');

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

Table.hasMany(List, {
    foreignKey: 'table_id',
    as: 'lists'
});

List.belongs(Table, {
    foreignKey: 'table_id',
    as: 'table'
});

List.hasMany(Card, {
    foreignKey: 'list_id',
    as: 'cards'
});

Card.belongsTo(List, {
    foreignKey: 'list_id',
    as: 'list'
});

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