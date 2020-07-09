// Importation des dépendances nécessaires
const { User, Table } = require('../models');
const validator = require('validator');

const tableController = {
    getAllTables: async (request, response) => {
        try {
            // On récupère tous les tableaux
            const tables = await Table.findAll();

            // On les envoie au front
            response.status(200).json(tables);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    getOneTable: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const tableId = parseInt(request.params.id, 10);
        
            // On vérifie que l'id est bien de type number
            if (isNaN(tableId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On récupère le tableau avec ses associations
            const table = await Table.findByPk(tableId, {
                include: [{
                    association: 'lists',
                    include: [{
                        association: 'cards',
                        include: ['tags']
                    }]
                }]
            });

            // S'il y a un tableau, on l'envoie au front, sinon une petite erreur
            if (table) {
                response.status(200).json(table);
            } else {
                response.status(404).json(`La table avec l'id ${tableId} n'existe pas`);
            }
        } 

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }   
    },

    getAllTablesFromOneUser: async (request, response) => {
        try {
            // On parse l'id reçu par la session
            let userId = parseInt(request.session.user, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(userId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On récupère les tableaux avec l'id de l'utilisateur
            const table = await Table.findAll({
                where: {
                    user_id: userId
                },
                include: [{
                    association: 'lists',
                    include: [{
                        association: 'cards',
                        include: ['tags']
                    }]
                }]
            });

            // On envoie les tableaux au front
            response.status(200).json(table);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    createTable: async (request, response) => {
        try {
            // On parse l'id reçu par la session
            const user_id = parseInt(request.session.user, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(user_id)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On déstructure le formulaire reçu
            let { name, background_color } = request.body;

            // On initialise un tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs ne sont pas vides
            if (!name) {
                bodyErrors.push('Le champ nom ne peut être vide');
            }

            if (!background_color) {
                bodyErrors.push('Le champ couleur de fond ne peut être vide');
            }

            // On vérifie que les champs sont bien valides
            if (name) {
                if (validator.blacklist(name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ nom ne peut contenir les caractères "<" ">" "&" et "/"');
                }
            }

            if (background_color) {
                if (!validator.isHexColor(background_color)) {
                    bodyErrors.push('Le champ couleur de fond doit respecter le format hexadécimal');
                }
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }

            // On crée le nouveau tableau
            const newTable = await Table.create({
                name,
                background_color,
                user_id
            });

            // On envoie le nouveau tableau au front
            response.status(201).json(newTable);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    updateOneTable: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const tableId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(tableId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On vérifie que l'id du tableau existe en BDD
            const table = await Table.findByPk(tableId);
            if (!table) {
                response.status(404).json(`Le tableau avec l'id ${tableId} n'existe pas`);
                return;
            }

            // On déstructure le formulaire reçu
            const { name, background_color } = request.body;

            // On initialise le tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs sont bien valides
            if (name) {
                if (validator.blacklist(name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ nom ne peut contenir les caractères "<" ">" "&" et "/"');
                }
            }

            if (background_color) {
                if (!validator.isHexColor(background_color)) {
                    bodyErrors.push('Le champ couleur de fond doit respecter le format hexadécimal');
                }
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
            }

            // On update les paramètres reçus
            if (name) {
                table.name = name;
            }

            if (background_color) {
                table.background_color = background_color;
            }

            // On enregistre les nouvelles données
            await table.save();

            // On envoie le tableau au front
            response.status(200).json(table);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    createOrUpdate: async (request, response) => {
        try {
            // On stocke dans une variable le formulaire reçu
            const posts = request.body;

            // On prépare un tableau avec les champs autorisés
            const authorizedPosts = [
                'name',
                'background_color'
            ];

            // On initialise un tableau d'erreurs
            const bodyErrors = [];

            // On boucle sur tous les champs reçus dans le formulaire
            // Si le champ n'est pas autorisé, on envoie une erreur
            for (const post in posts) {
                if (!authorizedPosts.includes(post)) {
                    bodyErrors.push(`Le champ ${post} n'existe pas`);
                }
            }

            // Si on reçoit un id, on vérifie que celui-ci est bien de type number
            if (request.params.id) {
                if (isNaN(parseInt(request.params.id, 10))) {
                    bodyErrors.push('L\'id spécifié doit être de type number');
                }
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }

            // On initialise une variable tableau
            let table;

            // Si on reçoit un id, on va récupérer le tableau
            if (request.params.id) {
                table = await Table.findByPk(request.params.id);
            }

            // S'il y a un tableau existant, on le modifie, sinon on le crée
            if (table) {
                await tableController.updateOneTable(request, response);
            } else {
                await tableController.createTable(request, response);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    deleteTable: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const tableId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(tableId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On récupère le tableau
            const table = await Table.findByPk(tableId);

            // S'il existe, on le supprime, sinon une petite erreur
            if (table) {
                await table.destroy();
                response.status(200).json('Le tableau a bien été supprimé');
            } else {
                response.status(404).json(`Le tableau avec l'id ${tableId} n'existe pas;`)
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    }
};

// Exportation du module
module.exports = tableController;