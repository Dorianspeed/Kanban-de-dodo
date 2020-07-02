const { Card, Tag } = require('../models');
const validator = require('validator');

const tagController = {
    getAllTags: async (request, response) => {
        try {
            const tags = await Tag.findAll();
            response.status(200).json(tags);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    getOneTag: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const tagId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(tagId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            const tag = await Tag.findByPk(tagId);

            if (tag) {
                response.status(200).json(tag);
            } else {
                response.status(404).json(`Le tag avec l'id ${tagId} n'existe pas`);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    createTag: async (request, response) => {
        try {
            // On déstructure le formulaire reçu
            const { name, background_color, text_color } = request.body;

            // On initialise un tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs ne sont pas vides
            if (!name) {
                bodyErrors.push('Le champ nom ne peut être vide');
            }

            if (!background_color) {
                bodyErrors.push('Le champ couleur de fond ne peut être vide');
            }

            if (!text_color) {
                bodyErrors.push('Le champ couleur de texte ne peut être vide');
            }

            // On vérifie que les champs sont bien valides
            if (name) {
                if (!validator.isAlphanumeric(name)) {
                    bodyErrors.push('Le champ nom ne doit contenir que des lettres et nombres');
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

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
            }

            // On crée le nouveau tag
            const newTag = await Tag.create({
                name,
                background_color,
                text_color
            });

            response.status(201).json(newTag);
        }
        
        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    updateOneTag: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const tagId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(tagId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On vérifie que l'id du tag existe en BDD
            const tag = await Tag.findByPk(tagId);
            if (!tag) {
                response.status(404).json(`La carte avec l'id ${tagId} n'existe pas`);
                return;
            }

            // On déstructure le formulaire reçu
            const { name, background_color, text_color } = request.body;

            // On initialise le tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs sont bien valides
            if (name) {
                if (!validator.isAlphanumeric(name)) {
                    bodyErrors.push('Le champ nom ne doit contenir que des lettres et nombres');
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

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }

            // On update les paramètres reçus
            if (name) {
                tag.name = name;
            }

            if (background_color) {
                tag.background_color = background_color;
            }

            if (text_color) {
                tag.text_color = text_color;
            }

            // On enregistre les nouvelles données
            await tag.save();

            response.status(200).json(tag);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    createOrUdpate: async (request, response) => {
        try {
            // On stocke dans une variable le formulaire reçu
            const posts = request.body;

            // On prépare un tableau avec les champs autorisés
            const authorizedPosts = [
                'name',
                'background_color',
                'text_color'
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

            // On initialise une variable tag
            let tag;

            // Si on reçoit un id, on va récupérer le tag
            if (request.params.id) {
                tag = await Tag.findByPk(request.params.id);
            }

            // S'il y a un tag existant, on le modifie, sinon on le crée
            if (tag) {
                await tagController.updateOneTag(request, response);
            } else {
                await tagController.createTag(request, response);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },
    
    deleteTag: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const tagId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(tagId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            const tag = await Tag.findByPk(tagId);

            if (tag) {
                await tag.destroy();
                response.status(200).json('Le tag a bien été supprimé');
            } else {
                response.status(404).json(`Le tag avec l'id ${tagId} n'existe pas`);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    associateTagToCard: async (request, response) => {
        try {
            // On parse les id reçus en nombres entiers
            const cardId = parseInt(request.params.id, 10);
            const tagId = parseInt(request.body.tagId, 10);
    
            // On vérifie que les id sont bien de type number
            if (isNaN(cardId)) {
                response.status(400).json('L\'id de la carte doit être de type number');
                return;
            }
    
            if (isNaN(tagId)) {
                response.status(400).json('L\'id du tag doit être de type number');
                return;
            }
    
            // On récupère la carte dans la BDD
            let card = await Card.findByPk(cardId);
            if (!card) {
                response.status(404).json(`La carte avec l'id ${cardId} n'existe pas`);
                return;
            }
    
            // On récupère le tag dans la BDD
            const tag = await Tag.findByPk(tagId);
            if (!tag) {
                response.status(404).json(`Le tag avec l'id ${tagId} n'existe pas`);
                return;
            }
    
            // On associe la carte et le tag
            await card.addTag(tag);
    
            // On récupère la carte dans la BDD qui a subi une mise à jour
            card = await Card.findByPk(cardId);
    
            response.status(200).json(card);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    removeTagFromCard: async (request, response) => {
        try {
            // On parse les id reçus en nombres entiers
            const cardId = parseInt(request.params.cardId, 10);
            const tagId = parseInt(request.params.tagId, 10);
    
            // On vérifie que les id sont bien de type number
            if (isNaN(cardId)) {
                response.status(400).json('L\'id de la carte doit être de type number');
                return;
            }
    
            if (isNaN(tagId)) {
                response.status(400).json('L\'id du tag doit être de type number');
                return;
            }
    
            // On récupère la carte dans la BDD
            let card = await Card.findByPk(cardId);
            if (!card) {
                response.status(404).json(`La carte avec l'id ${cardId} n'existe pas`);
                return;
            }
    
            // On récupère le tag dans la BDD
            const tag = await Tag.findByPk(tagId);
            if (!tag) {
                response.status(404).json(`Le tag avec l'id ${tagId} n'existe pas`);
                return;
            }
    
            // On dissocie la carte et le tag
            await card.removeTag(tag);
    
            // On récupère la carte dans la BDD qui a subi une mise à jour
            card = await Card.findByPk(card);

            response.status(200).json(card);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    }
};

module.exports = tagController;