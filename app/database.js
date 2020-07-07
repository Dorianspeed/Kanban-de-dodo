// Importation de la dépendance
const { Sequelize } = require('sequelize');

// Connexion à la database
const sequelize = new Sequelize(process.env.PG_URL, {
    define: {
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Exportation du module
module.exports = sequelize