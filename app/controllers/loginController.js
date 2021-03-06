// Importation des dépendances nécessaires
const { User } = require('../models');
const validator = require('validator');
const bcrypt = require('bcrypt');

const loginController = {
    login: async (request, response) => {
        try {
            // On déstructure le formulaire reçu
            const { email, password } = request.body;

            // On initialise un tableau d'erreurs
            const bodyErrors = [];

            // On vérifie que les champs ne sont pas vides
            if (!email) {
                bodyErrors.push('Le champ email ne peut être vide');
            }

            if (!password) {
                bodyErrors.push('Le champ password ne peut être vide');
            }

            // On vérifie que l'email est bien valide
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

            // On récupère l'utilisateur dans la BDD
            let user = await User.findOne({
                where: {email: email}
            });

            // Si aucun utilisateur trouvé, on envoie un message d'erreur
            if (!user) {
                response.status(404).json('Le couple email / mot de passe ne correspond pas');
                return;
            }

            // On vérifie la concordance entre les deux mots de passe
            const validPassword = await bcrypt.compare(password, user.password);

            // Si les deux mots de passe ne concordent pas, on envoie un message d'erreur
            if(!validPassword) {
                response.status(404).json('Le couple email / mot de passe ne correspond pas');
                return;
            }

            // Si tout va bien, on stocke l'id de l'utilisateur en session
            request.session.user = user.id;
            
            // On envoie un message au front
            response.status(200).json('ok');
        }

        catch (error) {
            console.trace(error);
            response.status(500).json(error);
        }
    },

    disconnect: (request, response) => {
        // On détruit la session
        request.session.destroy();

        // On envoie un message au front
        response.status(200).json('ok');
    }
};

// Exportation du module
module.exports = loginController;