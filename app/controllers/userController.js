// Importation des dépendances
const { User } = require('../models');
const validator = require('validator');
const bcrypt = require('bcrypt')

const userController = {
    getAllUsers: async (request, response) => {
        try {
            // On récupère tous les utilisateurs
            const users = await User.findAll();

            // On les envoie au front
            response.status(200).json(users);
        }
        
        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    getOneUser: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const userId = parseInt(request.params.id, 10);
    
            // On vérifie que l'id est bien de type number
            if (isNaN(userId)) {
                response.status(400).json('L\id spécifié doit être de type number');
                return;
            }

            // On récupère l'utilisateur
            const user = await User.findByPk(userId, {
                include: ['tables', 'lists', 'cards', 'tags']
            });

            // S'il existe, on l'envoie au front, sinon une petite erreur
            if (user) {
                response.status(200).json(user);
            } else {
                response.status(404).json(`L'utilisateur avec l'id ${userId} n'existe pas`);                
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    createUser: async (request, response) => {
        try {
            // On déstructure le formulaire reçu
            const { first_name, last_name, email, password, confirmedPassword } = request.body;

            // On initialise un tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs ne sont pas vides
            if (!first_name) {
                bodyErrors.push('Le champ prénom ne peut être vide');
            }
            
            if (!last_name) {
                bodyErrors.push('Le champ nom ne peut être vide');
            }

            if (!email) {
                bodyErrors.push('Le champ email ne peut être vide');
            }

            if (!password) {
                bodyErrors.push('Le champ mot de passe ne peut être vide');
            }

            if (!confirmedPassword) {
                bodyErrors.push('Le champ confirmation du mot de passe ne peut être vide');
            }

            // On vérifie que les champs first_name et last_name ne contiennent que des lettres
            if (first_name) {
                if (validator.blacklist(first_name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ prénom ne peut contenir les caractères "<" ">" "&" et "/"');
                }            
            }

            if (last_name) {
                if (validator.blacklist(last_name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ nom ne peut contenir les caractères "<" ">" "&" et "/"');
                }
            }

            // On vérifie que l'email est valide
            if (email) {
                if (!validator.isEmail(email)) {
                    bodyErrors.push('Le champ email doit être valide');
                }                
            }

            // On vérifie que le mot de passe et sa confirmation matchent
            if (password && confirmedPassword) {
                if (password !== confirmedPassword) {
                    bodyErrors.push('Les champs mot de passe et confirmation du mot de passe ne concordent pas');
                }
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }
            
            // On vérifie que l'email n'est pas déjà utilisé par un autre utilisateur
            const foundUser = await User.findOne({
                where: {
                    email: email
                }
            });

            if (foundUser) {
                response.status(409).json('Cet email est déjà utilisé par un utilisateur');
                return;
            }

            // On crypte le mot de passe reçu avant mise en BDD
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);

            // On crée le nouvel utilisateur
            const newUser = await User.create({
                first_name,
                last_name,
                email,
                password: encryptedPassword
            });

            // On envoie le nouvel utilisateur au front
            response.status(201).json(newUser);
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    updateOneUser: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const userId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(userId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On vérifie que l'id de l'utilisateur existe en BDD
            const user = await User.findByPk(userId);
            if (!user) {
                response.status(404).json(`L'utilisateur avec l'id ${userId} n'existe pas`);
                return;
            }

            // On déstructure le formulaire reçu
            const { first_name, last_name, email, password } = request.body;

            // On initialise le tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs first_name et last_name ne contiennent que des lettres
            if (first_name) {
                if (validator.blacklist(first_name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ prénom ne peut contenir les caractères "<" ">" "&" et "/"');
                }              
            }

            if (last_name) {
                if (validator.blacklist(last_name, '^\<|\>|\/|\&')) {
                    bodyErrors.push('Le champ nom ne peut contenir les caractères "<" ">" "&" et "/"');
                }
            }

            // On vérifie que l'email est valide
            if (email) {
                if (!validator.isEmail(email)) {
                    bodyErrors.push('Le champ email doit être valide');
                }                
            }

            // On envoie le tableau en cas d'erreurs
            if (bodyErrors.length) {
                response.status(400).json(bodyErrors);
                return;
            }
            
            // On vérifie que l'email n'est pas déjà utilisé par un autre utilisateur
            if (email) {
                const foundUser = await User.findOne({
                    where: {
                        email: email
                    }
                });

                if (foundUser) {
                    response.status(409).json('Cet email est déjà utilisé par un utilisateur');
                    return;
                }
            }

            // On update les paramètres reçus
            if (first_name) {
                user.first_name = first_name;
            }

            if (last_name) {
                user.last_name = last_name;
            }

            if (email) {
                user.email = email;
            }

            if (password) {
                // On crypte le mot de passe reçu avant mise en BDD
                const salt = await bcrypt.genSalt(10);
                const encryptedPassword = await bcrypt.hash(email, salt);
                user.password = encryptedPassword;
            }

            // On enregistre les nouvelles données
            await user.save();

            // On envoie l'utilisateur au front
            response.status(200).json(user);
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
                'first_name',
                'last_name',
                'email',
                'password'
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

            // On initialise une variable utilisateur
            let user;
            
            // Si on reçoit un id, on va récupérer l'utilisateur
            if (request.params.id) {
                user = await User.findByPk(request.params.id)
            }

            // S'il y a un utilisateur existant, on le modifie, sinon on le crée
            if (user) {
                await userController.updateOneUser(request, response);
            } else {
                await userController.createUser(request, response);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    deleteUser: async (request, response) => {
        try {
            // On parse l'id reçu en un nombre entier
            const userId = parseInt(request.params.id, 10);

            // On vérifie que l'id est bien de type number
            if (isNaN(userId)) {
                response.status(400).json('L\'id spécifié doit être de type number');
                return;
            }

            // On récupère l'utilisateur
            const user = await User.findByPk(userId);

            // S'il existe, on le supprime, sinon une petite erreur
            if (user) {
                await user.destroy();
                response.status(200).json('L\'utilisateur a bien été supprimé');
            } else {
                response.status(404).json(`L'utilisateur avec l'id ${userId} n'existe pas`);
            }
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    }
};

// Exportation du module
module.exports = userController;