// Importation des dépendances nécessaires
const { Card } = require('../models');
const validator = require('validator');

const cardController = {
    getAllCards: async (request, Response) => {
        try {
            // On récupère toutes les cartes
            const cards = await Card.findAll();

            // On les envoie au front
            response.status(200).json(cards);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    getOneCard: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const cardId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(cardId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On récupère la carte
            const card = await Card.findByPk(cardId);

            // S'il y a une carte, on l'envoie au front sinon, une petite erreur
            if (card) {
                response.status(200).json(card);
            } else {
                response.status(404).json(`La carte avec l'id ${cardId} n'existe pas`);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    createCard: async (request, response) => {
        try {
            // On parse l'id reçu par la session
            const user_id = parseInt(request.session.user, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(user_id)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On déstructure le formulaire reçu
            const { name, position, background_color, text_color, list_id } = request.body;

            // On initialise un tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs ne sont pas vides
            if (!name) {
                bodyErrors.push('Le champ nom ne peut être vide');
            }

            if (!position) {
                bodyErrors.push('Le champ position ne peut être vide');
            }

            if (!background_color) {
                bodyErrors.push('Le champ couleur de fond ne peut être vide');
            }

            if (!text_color) {
                bodyErrors.push('Le champ couleur de texte ne peut être vide');
            }

            if (!list_id) {
                bodyErrors.push('Le champ id de liste ne peut être vide');
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

            if (background_color) {
                if (!validator.isHexColor(background_color)) {
                    bodyErrors.push('Le champ couleur de fond doit respecter le format hexadécimal');
                }
            }

            if (text_color) {
                if (!validator.isHexColor(text_color)) {
                    bodyErrors.push('Le champ couleur de texte doit respecter le format hexadécimal');
                }
            }

            if (list_id) {
                if (isNaN(parseInt(list_id, 10))) {
                    bodyErrors.push('Le champ id de liste doit être de type number');
                }
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }

            // On crée la nouvelle carte
            const newCard = await Card.create({
                name,
                position,
                background_color,
                text_color,
                user_id,
                list_id
            });

            // On l'envoie au front
            response.status(201).json(newCard);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    updateOneCard: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const cardId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(cardId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On vérifie que l'id de la carte existe en BDD
            const card = await Card.findByPk(cardId);
            if (!card) {
                response.status(404).json(`La carte avec l'id ${cardId} n'existe pas`);
                return;
            }

            // On déstructure le formulaire reçu
            const { name, position, background_color, text_color, list_id } = request.body;

            // On initialise le tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs sont bien valides
            if (name) {
                if (validator.blacklist(name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ nom ne peut contenir les caractères "<" ">" "&" et "/"');
                }
            }

            if (position) {
                if (isNaN(position)) {
                    bodyErrors.push('Le champ position doit être de type number');
                }
            }

            if (background_color) {
                if (!validator.isHexColor(background_color)) {
                    bodyErrors.push('Le champ couleur de fond doit respecter le format hexadécimal');
                }
            }

            if (text_color) {
                if (!validator.isHexColor(text_color)) {
                    bodyErrors.push('Le champ couleur de texte doit respecter le format hexadécimal');
                }
            }

            if (list_id) {
                if (isNaN(parseInt(list_id, 10))) {
                    bodyErrors.push('Le champ id de liste doit être de type number');
                }
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }

            // On update les paramètres reçus
            if (name) {
                card.name = name;
            }

            if (position) {
                card.position = position;
            }

            if (background_color) {
                card.background_color = background_color;
            }

            if (text_color) {
                card.text_color = text_color;
            }

            if (list_id) {
                card.list_id = list_id;
            }

            // On enregistre les nouvelles données
            await card.save();

            // On envoie la carte au front
            response.status(200).json(card);
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
                'background_color',
                'text_color',
                'list_id'
            ];

            // On initialise un tableau d'erreurs
            const bodyErrors = [];

            // On boucle sur tous les champs reçus dans le formulaire
            // Si le champ n'est pas autorisé, on envoie une erreur
            for (const post in posts) {
                if (!authorizedPosts.includes(post)) {
                    bodyErrors.push(`le champ ${post} n'existe pas`);
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

            // On initialise une variable card
            let card;

            // Si on reçoit un id, on va récupérer la carte
            if (request.params.id) {
                card = await Card.findByPk(request.params.id);
            }

            // S'il y a une carte existante, on la modifie, sinon on la crée
            if (card) {
                await cardController.updateOneCard(request, response);
            } else {
                await cardController.createCard(request, response);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    deleteCard: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const cardId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(cardId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On récupère la carte
            const card = await Card.findByPk(cardId);

            // S'il y a une carte, on la supprime, sinon une petite erreur
            if (card) {
                await card.destroy();
                response.status(200).json('La carte a été supprimée');
            } else {
                response.status(404).json(`La carte avec l'id ${cardId} n'existe pas`);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    }
};

// Exportation du module
module.exports = cardController;