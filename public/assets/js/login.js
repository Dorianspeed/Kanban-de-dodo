const app = {
    init: () => {
        app.addListenerToActions();
    },

    base_url: 'http://localhost:3000',

    addListenerToActions: () => {
        // On ajoute un évènement sur le formulaire lors de sa soumission
        document.querySelector('form').addEventListener('submit', app.handleLoginForm);
    },

    handleLoginForm: async (event) => {
        try {
            // On supprime le comportement par défaut du formulaire
            event.preventDefault();

            // On stocke les données du formulaire
            let data = new FormData(event.target);

            // On fait un requête au serveur
            let response = await fetch (app.base_url + '/login', {
                method: 'POST',
                body: data
            });

            // Si le status de réponse n'est pas correct, on génère des erreurs
            if (response.status !== 200) {
                // On récupère les erreurs de la requête
                let errors = await response.json();
                
                // On vide le contenu de la liste
                document.querySelector('ul').textContent = '';
                
                // On vérifie si l'on reçoit un tableau. Si oui, on boucle les erreurs
                if (Array.isArray(errors)) {
                    for (let error of errors) {
                        app.makeErrorInDOM(error);
                    }
                } else {
                    app.makeErrorInDOM(errors);
                }
                
                // On envoie les erreurs à l'attrapeur (catch)
                throw errors;
            } else {
                // Si le status est correct, on redirige
                let user = await response.json();
                location = '/kanban';
            }
        }

        catch (error) {
            console.trace(error);
        }
    },

    makeErrorInDOM: (error) => {
        // On récupère le template
        let template = document.getElementById('template-error');

        // On le clone
        let newError = document.importNode(template.content, true);

        // On change la valeur
        newError.querySelector('li').textContent = error;

        // On l'insère dans la liste
        document.querySelector('ul').appendChild(newError);
    }
};

document.addEventListener('DOMContentLoaded', app.init);