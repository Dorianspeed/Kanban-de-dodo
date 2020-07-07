// Importation des dépendances nécessaires
const { List } = require('../models');
const validator = require('validator');

const listController = {
    getAllLists: async (request, response) => {
        try {
            // On récupère toutes les listes
            const lists = await List.findAll();

            // On les envoie au front
            response.status(200).json(lists);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    getOneList: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const listId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(listId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
            }

            // On récupère la liste
            const list = await List.findByPk(listId);

            // S'il y a une liste, on l'envoie au front, sinon une petite erreur
            if (list) {
                response.status(200).json(list);
            } else {
                response.status(404).json(`La liste avec l'id ${listId} n'existe pas`);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    createList: async (request, response) => {
        try {
            // On déstructure le formulaire reçu
            const { name, position, user_id, table_id } = request.body;

            // On initialise un tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs ne sont pas vides
            if (!name) {
                bodyErrors.push('Le champ nom ne peut être vide');
            }

            if (!position) {
                bodyErrors.push('Le champ position ne peut être vide');
            }

            if (!user_id) {
                bodyErrors.push('Le champ id de l\'utilisateur ne peut être vide');
            }

            if (!table_id) {
                bodyErrors.push('Le champ id de la table ne peut être vide');
            }

            // On vérifie que les champs sont bien valides
            if (name) {
                if (validator.blacklist(name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ nom ne peut contenir les caractères "<" ">" "&" et "/"');
                }
            }

            if (position) {
                if (isNaN(parseInt(position, 10))) {
                    bodyErrors.push('Le champ position doit être de type number');
                }
            }

            if (user_id) {
                if (isNaN(parseInt(user_id, 10))) {
                    bodyErrors.push('Le champ id de l\'utilisateur doit être de type number');
                }
            }

            if (table_id) {
                if (isNaN(parseInt(table_id, 10))) {
                    bodyErrors.push('Le champ id de la table doit être de type number')
                }
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }

            // On crée la nouvelle liste
            const newList = await List.create({
                name,
                position,
                user_id,
                table_id
            });

            // On envoie la nouvelle liste au front
            response.status(201).json(newList);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    updateOneList: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const listId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(listId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On vérifie que l'id de la liste existe en BDD
            const list = await List.findByPk(listId);
            if (!list) {
                response.status(404).json(`La liste avec l'id ${listId} n'existe pas`);
                return;
            }

            // On déstructure le formulaire reçu
            const { name, position, table_id } = request.body;

            // On initialise le tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs sont bien valides
            if (name) {
                if (validator.blacklist(name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ nom ne peut contenir les caractères "<" ">" "&" et "/"');
                }
            }

            if (position) {
                if (isNaN(parseInt(position, 10))) {
                    bodyErrors.push('Le champ position doit être de type number');
                }
            }

            if (table_id) {
                if (isNaN(parseInt(table_id, 10))) {
                    bodyErrors.push('Le champ id de la table doit être de type number')
                }
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }

            // On update les paramètres reçus
            if (name) {
                list.name = name;
            }

            if (position) {
                list.position = position;
            }

            if (table_id) {
                list.table_id = table_id;
            }

            // On enregistre les nouvelles données
            await list.save();

            // On envoie la liste au front
            response.status(200).json(list);
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
                'position',
                'table_id'
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

            // On initialise une variable liste
            let list;

            // Si on reçoit un id, on va récupéré la liste
            if (request.params.id) {
                list = List.findByPk(listId);
            }

            // S'il y a une liste existante, on la modifie, sinon on la crée
            if (list) {
                await listController.updateOneList(request, response);
            } else {
                await listController.createList(request, response);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },
    
    deleteList: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const listId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(listId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On récupère la liste
            const list = await List.findByPk(listId);

            // S'il y a une liste, on la supprime, sinon une petite erreur
            if (list) {
                await list.destroy();
                response.status(200).json('La liste a bien été supprimée');
            } else {
                response.status(404).json(`La liste avec l'id ${listId} n'existe pas`);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    }
};

// Exportation du module
module.exports = listController;