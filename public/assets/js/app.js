const app = {
    init: () => {
        app.addListenerToActions();
        app.addResponsiveBurgerEvent();
        app.getTablesFromAPI();
        app.getTagsFromAPI();
        app.makeListsDroppable();
    },

    base_url: '',

    addListenerToActions: () => {
        // Bouton "Ajouter un tableau"
        document.getElementById('addTableButton').addEventListener('touchstart', app.showAddTableModal);
        
        // Bouton "Ajouter une liste"
        document.getElementById('addListButton').addEventListener('touchstart', app.showAddListModal);

        // Bouton "Ajouter un nouveau tag"
        document.getElementById('addTagButton').addEventListener('touchstart', app.showAddTagModal);

        // Bouton "Modifier un tag"
        document.getElementById('editTagButton').addEventListener('touchstart', app.showEditTagModal);

        // Bouton "Supprimer un tag"
        document.getElementById('deleteTagButton').addEventListener('touchstart', app.showDeleteTagModal);

        // Bouton "Fermer les modales"
        let modals = document.querySelectorAll('.close');
        for (let modal of modals) {
            modal.addEventListener('touchstart', app.hideModals);
        }

        // Bouton "Modifier le tableau"
        document.getElementById('editTableButton').addEventListener('touchstart', app.showEditTableModal);

        // Bouton "Supprimer le tableau"
        document.getElementById('deleteTableButton').addEventListener('touchstart', app.deleteTableFromDOM);

        // Bouton "Se déconnecter"
        document.getElementById('disconnect').addEventListener('touchstart', app.disconnectFromApp);

        // Formulaire "Ajouter un tableau"
        document.querySelector('#addTableModal form').addEventListener('submit', app.handleAddTableForm);

        // Formulaire "Ajouter une liste"
        document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);

        // Formulaire "Ajouter une carte"
        document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);

        // Formulaire "Ajouter un nouveau tag"
        document.querySelector('#addTagModal form').addEventListener('submit', app.handleAddTagForm);

        // Formulaire "Modifier un tableau"
        document.querySelector('#editTableModal form').addEventListener('submit', app.handleEditTableForm);

        // Formulaire "Modifier un tag"
        document.querySelector('#editTagModal form').addEventListener('submit', app.handleEditTagForm);

        // Formulaire "Associer un tag à une carte"
        document.querySelector('#addTagToCardModal form').addEventListener('submit', app.handleAddTagToCardForm);

        // Formulaire "Supprimer un tag"
        document.querySelector('#deleteTagModal form').addEventListener('submit', app.handleDeleteTagFromAPIForm);

        // Evènement sur la modification du select "Modifier un tag"
        document.querySelector('#editTagModal select').addEventListener('change', (event) => {
            // On récupère la modale
            let modal = event.target.closest('.modal');

            // On attribue les valeurs des inputs grâce aux attributs contenus dans les balises option
            modal.querySelector('input[name="name"]').value = modal.querySelector(`option[value="${event.target.value}"]`).getAttribute('name');
            modal.querySelector('input[name="background_color"]').value = modal.querySelector(`option[value="${event.target.value}"]`).getAttribute('backgroundColor');
            modal.querySelector('input[name="text_color"]').value = modal.querySelector(`option[value="${event.target.value}"]`).getAttribute('textColor');
        });
    },

    showAddTableModal: () => {
        // On affiche la modale
        document.getElementById('addTableModal').classList.add('is-active');
    },

    showAddListModal: () => {
        // On récupère l'id de la table
        let tableId = document.getElementById('table').getAttribute('data-table-id');
        
        // On récupère l'input de la modale
        let input = document.getElementById('addListModal').querySelector('input[name="table_id"]');
        
        // On change sa valeur
        input.value = tableId;

        // On affiche la modale
        document.getElementById('addListModal').classList.add('is-active');
    },

    showAddCardModal: (event) => {
        // On récupère l'id de la liste
        let listId = event.target.closest('.list').getAttribute('data-list-id');

        // On récupère l'input de la modale
        let input = document.getElementById('addCardModal').querySelector('input[name="list_id"]');

        // On change sa valeur
        input.value = listId;

        // On affiche la modale
        document.getElementById('addCardModal').classList.add('is-active');
    },

    showAddTagModal: () => {
        // On affiche la modale
        document.getElementById('addTagModal').classList.add('is-active');
    },

    showEditTableModal: () => {
        // On affiche la modale
        document.getElementById('editTableModal').classList.add('is-active');
    },

    showEditTagModal: () => {
        // On affiche la modale
        document.getElementById('editTagModal').classList.add('is-active');
    },

    showAddTagToCardModal: (event) => {
        // On récupère l'id de la carte
        let cardId = event.target.closest('.card').getAttribute('data-card-id');

        // On récupère l'input de la modale
        let input = document.getElementById('addTagToCardModal').querySelector('input[name="card_id"]');

        // On change sa valeur
        input.value = cardId;

        // On affiche la modale
        document.getElementById('addTagToCardModal').classList.add('is-active');
    },

    showDeleteTagModal: () => {
        // On affiche la modale
        document.getElementById('deleteTagModal').classList.add('is-active');
    },

    showEditListForm: (event) => {
        // On récupère les élements
        let listElement = event.target.closest('.list');
        let formElement = listElement.querySelector('form');

        // On met la valeur existante dans l'input
        formElement.querySelector('input[name="name"]').value = listElement.querySelector('h2').textContent;

        // On affiche le formulaire et on masque le h2
        listElement.querySelector('h2').classList.add('is-hidden');
        formElement.classList.remove('is-hidden');

        // On cache les trois boutons
        listElement.querySelector('.button--edit-list').classList.add('is-hidden');
        listElement.querySelector('.button--delete-list').classList.add('is-hidden');
        listElement.querySelector('.button--add-card').classList.add('is-hidden');
    },

    showEditCardForm: (event) => {
        // On récupère les élements
        let cardElement = event.target.closest('.card');
        let formElement = cardElement.querySelector('form');

        // On met la valeur existante dans l'input
        formElement.querySelector('input[name="name"]').value = cardElement.querySelector('.card-name').textContent;

        // On affiche le formulaire et on masque la div
        cardElement.querySelector('.card-name').classList.add('is-hidden');
        formElement.classList.remove('is-hidden');

        // On cache les trois boutons
        cardElement.querySelector('.button--edit-card').classList.add('is-hidden');
        cardElement.querySelector('.button--delete-card').classList.add('is-hidden');
        cardElement.querySelector('.button--add-tag').classList.add('is-hidden');
    },

    hideModals: () => {
        // On récupère toutes les modales
        let modals = document.querySelectorAll('.modal');

        // On retire la classe sur chaque modale
        for (let modal of modals) {
            modal.classList.remove('is-active');
        }
    },

    handleAddTableForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/tables', {
                method: 'POST',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 201) {
                // En cas d'erreurs, on récupère l'erreur et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère le tableau
                let table = await response.json();

                // On crée le nouveau tableau et on redirige vers celui-ci
                app.makeTableListInDOM(table.id, table.name);
                app.showCreatedtable(table.id, table.name, table.background_color);

                // On réinitialise les inputs du formulaire
                let form = document.querySelector('#addTableModal form');
                form.querySelector('input[name="name"]').value = '';
                form.querySelector('input[name="background_color"]').value = '#CCCCCC';
            }

            // On ferme la modale
            app.hideModals();
        }

        catch (error) {
            alert(error);
            console.trace(error);
        }
    },

    handleAddListForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault()

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On récupère le nombre de listes déjà présentes pour définir la position de la nouvelle liste
            let numberOfLists = document.querySelectorAll('div[data-list-id]').length;

            // On intégre des données aux data
            data.set('position', numberOfLists);

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/lists', {
                method: 'POST',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 201) {
                // En cas d'erreurs, on récupère l'erreur et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère la liste
                let list = await response.json();

                // On crée la nouvelle liste
                app.makeListInDOM(list.id, list.name);

                // On réinitialise l'input du formulaire
                let form = document.querySelector('#addListModal form');
                form.querySelector('input[name="name"]').value = '';
            }

            // On ferme la modale
            app.hideModals();
        }

        catch (error) {
            alert(error);
            console.trace(error);
        }
    },

    handleAddCardForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On récupère l'id de la liste stocké dans l'input
            let listId = document.querySelector('#addCardModal input[name="list_id"]').value;

            // On génère la position de la carte en fonction du nombre de cartes déjà présentes
            let numberOfCards = document.querySelectorAll(`div[data-list-id="${listId}"] .box`).length;

            // On intègre les données aux data
            data.set('position', numberOfCards);

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/cards', {
                method: 'POST',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 201) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout se passe bien, on récupère la carte
                let card = await response.json();

                // On crée la carte
                app.makeCardInDOM(card.id, card.name, card.background_color, card.text_color, card.list_id);

                // On réinitialise les inputs du formulaire
                let form = document.querySelector('#addCardModal form');
                form.querySelector('input[name="name"]').value = '';
                form.querySelector('input[name="background_color"]').value = '#FFFFFF';
                form.querySelector('input[name="text_color"]').value = '#000000';
            }

            // On ferme la modale
            app.hideModals();
        }

        catch (error) {
            alert(error);
            console.trace(error);
        }
    },

    handleAddTagForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/tags', {
                method: 'POST',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 201) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère le tag
                let tag = await response.json();

                // On crée le tag dans les trois listes du DOM
                app.makeAddTagListInDOM(tag.id, tag.name);
                app.makeEditTagListInDOM(tag.id, tag.name, tag.background_color, tag.text_color);
                app.makeDeleteTagListInDOM(tag.id, tag.name);

                // On réinitialise le formulaire
                let form = document.querySelector('#addTagModal form');
                form.querySelector('input[name="name"]').value = '';
                form.querySelector('input[name="background_color"]').value = '#FFFFFF';
                form.querySelector('input[name="text_color"]').value = '#000000';
            }

            // On ferme la modale
            app.hideModals();
        }

        catch (error) {
            alert(error);
            console.trace(error);
        }
    },

    handleAddTagToCardForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On récupère l'id de la carte
            let cardId = event.target.querySelector('input[name="card_id"]').value;

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/cards/' + cardId + '/tags', {
                method: 'POST',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère la carte
                let card = await response.json();

                // On vide le textContent de la carte
                document.querySelector(`[data-card-id="${cardId}"]`).querySelector('.is-grouped-multiline').textContent = '';

                // On recrée tous les tags contenus dans celle-ci
                for (let tag of card.tags) {
                    app.makeTagInDOM(tag.id, tag.name, tag.background_color, tag.text_color, card.id);
                }
            }

            // On ferme la modale
            app.hideModals();
        }

        catch (error) {
            alert('Impossible d\'associer le tag à la carte');
            console.trace(error);
        }
    },

    handleEditTableForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On récupère l'id du tableau
            let tableId = document.querySelector('.section').getAttribute('data-table-id');

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/tables/' + tableId, {
                method: 'PATCH',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère le tableau
                let table = await response.json();

                // On édite les noms de la liste déroulante
                document.querySelector('.navbar-link').textContent = table.name;
                document.querySelector(`a[data-table-id="${tableId}"]`).textContent = table.name;

                // On définit la couleur de fond
                document.body.style.backgroundColor = table.background_color;
            }

            // On ferme la modale
            app.hideModals();
        }

        catch (error) {
            alert(error);
            console.trace(error);
        }
    },

    handleEditListForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On récupère l'élément ciblé et l'id
            let listElement = event.target.closest('.list');
            let listId = listElement.getAttribute('data-list-id');
            
            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/lists/' + listId, {
                method: 'PATCH',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère la liste
                let list = await response.json();

                // On change le nom de la liste
                listElement.querySelector('h2').textContent = list.name;
            }

            // On affiche le h2 et on cache le formulaire
            listElement.querySelector('h2').classList.remove('is-hidden');
            listElement.querySelector('form').classList.add('is-hidden');

            // On affiche les trois boutons
            listElement.querySelector('.button--edit-list').classList.remove('is-hidden');
            listElement.querySelector('.button--delete-list').classList.remove('is-hidden');
            listElement.querySelector('.button--add-card').classList.remove('is-hidden');
        }

        catch (error) {
            alert(error);
            console.trace(error);
        }
    },

    handleEditCardForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On récupère l'élément ciblé et l'id
            let cardElement = event.target.closest('.card');
            let cardId = cardElement.getAttribute('data-card-id');

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/cards/' + cardId, {
                method: 'PATCH',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère la carte
                let card = await response.json();

                // On définit les nouvelles valeurs
                cardElement.querySelector('.card-name').textContent = card.name;
                cardElement.setAttribute('style', 'background-color: ' + card.background_color + '; color: ' + card.text_color);
            }

            // On affiche la div et on cache le formulaire
            cardElement.querySelector('.card-name').classList.remove('is-hidden');
            cardElement.querySelector('form').classList.add('is-hidden');

            // On affiche les trois boutons
            cardElement.querySelector('.button--edit-card').classList.remove('is-hidden');
            cardElement.querySelector('.button--delete-card').classList.remove('is-hidden');
            cardElement.querySelector('.button--add-tag').classList.remove('is-hidden');
        }

        catch (error) {
            alert(error);
            console.trace(error);
        }
    },

    handleEditTagForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère les données du formulaire
            let data = new FormData(event.target);

            // On récupère l'id
            let tagId = event.target.querySelector('select[name="tagId"]').value;

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/tags/' + tagId, {
                method: 'PATCH',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: data
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère le tag
                let modifiedTag = await response.json();
                
                // On sélectionne tous les tags existants sur les cartes
                let tags = document.querySelectorAll(`div[data-tag-id="${tagId}"]`);

                // S'il y a des tags, on définit les nouvelles valeurs
                if (tags) {
                    for (let tag of tags) {
                        tag.querySelector('span').textContent = modifiedTag.name;
                        tag.querySelector('span').setAttribute('style', 'background-color: ' + modifiedTag.background_color + '; color: ' + modifiedTag.text_color);
                    }
                }

                // On sélection tous les tags existants dans les listes
                let tagsInForm = document.querySelectorAll(`option[value="${tagId}"]`)

                // S'il y a des tags, on définit le nouveau nom
                if (tagsInForm) {
                    for (let tagInForm of tagsInForm) {
                        tagInForm.textContent = modifiedTag.name;
                    }
                }

                // On sélectionne le tag contenu dans la liste d'édition des tags
                let option = document.querySelector(`#editTagList option[value="${tagId}"]`);

                // On définit les attributs en fonction des nouvelles valeurs
                option.setAttribute('name', modifiedTag.name);
                option.setAttribute('backgroundColor', modifiedTag.background_color);
                option.setAttribute('textColor', modifiedTag.text_color);

                // On réinitialise le formulaire
                document.getElementById('editTagList').value = '';
                document.getElementById('editTagModal').querySelector('input[name="name"]').value = '';
                document.getElementById('editTagModal').querySelector('input[name="background_color"]').value = '#FFFFFF';
                document.getElementById('editTagModal').querySelector('input[name="text_color"]').value = '#000000';
            }

            // On ferme la modale
            app.hideModals();
        }
        
        catch (error) {
            alert(error);
            console.trace(error);
        }
    },

    handleDeleteTagFromAPIForm: async (event) => {
        try {
            // On supprime le comportement par défaut
            event.preventDefault();

            // On récupère l'id
            let tagId = event.target.querySelector('select[name="tagId"]').value;

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/tags/' + tagId, {
                method: 'DELETE',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère le message
                let message = await response.json();

                // On récupère toutes les balises option qui lui sont liés
                let selects = document.querySelectorAll(`option[value="${tagId}"]`);

                // On les supprime
                for (let select of selects) {
                    select.parentNode.removeChild(select);
                }

                // On récupère tous les tags existants dans les cartes
                let tags = document.querySelectorAll(`div[data-tag-id="${tagId}"]`);

                // On les supprime
                for (let tag of tags) {
                    tag.parentNode.removeChild(tag);
                }
            }

            // On ferme la modale
            app.hideModals();
        }

        catch (error) {
            alert('Impossible de supprimer le tag');
            console.trace(error);
        }
    },

    handleDropList: (event) => {
        // On récupère les évènements
        const targetColumn = event.to;
        const originColumn = event.from;

        // On sélectionne toutes les listes
        let lists = originColumn.querySelectorAll('.list');

        // On les update
        app.updateAllLists(lists);

        // On gère le cas où la colonne ciblée est différente de la colonne d'origine
        if (originColumn !== targetColumn) {
            // On sélectionne toutes les listes
            lists = targetColumn.querySelectorAll('.list');

            // On les update
            app.updateAllLists(lists);
        }
    },

    handleDropCard: (event) => {
        // On récupère les évènements
        const targetList = event.to;
        const originList = event.from;

        // On sélectionne toutes les cartes
        let cards = originList.querySelectorAll('.box');

        // On récupère l'id de la liste d'origine
        let listId = originList.closest('.list').getAttribute('data-list-id');

        // On update les cartes
        app.updateAllCards(cards, listId);

        // On gère le cas où la liste ciblée est différente de la liste d'origine
        if (originList !== targetList) {
            // On sélectionne toutes les cartes
            cards = targetList.querySelectorAll('.box');

            // On récupère l'id de la liste ciblée
            listId = targetList.closest('.list').getAttribute('data-list-id');

            // On update les cartes
            app.updateAllCards(cards, listId);
        }
    },

    makeTableListInDOM: (tableId, name) => {
        // On récupère le template
        let template = document.getElementById('template-table');

        // On crée une nouvelle copie
        let newTable = document.importNode(template.content, true);

        // On change les valeurs
        newTable.querySelector('a').textContent = name;
        newTable.querySelector('a').setAttribute('data-table-id', tableId);

        // On ajoute les events listener
        newTable.querySelector('a').addEventListener('touchstart', app.showClickedTable);

        // On insère la table dans le DOM
        document.querySelector('.navbar-dropdown').appendChild(newTable);
    },

    makeAddTagListInDOM : (tagId, name) => {
        // On récupère le template
        let template = document.getElementById('template-tagOption');

        // On crée une nouvelle copie
        let newTag = document.importNode(template.content, true);

        // On change les valeurs
        newTag.querySelector('option').setAttribute('value', tagId);
        newTag.querySelector('option').textContent = name;

        // On insère le tag dans le DOM
        document.getElementById('addTagList').appendChild(newTag);
    },

    makeEditTagListInDOM : (tagId, name, backgroundColor, textColor) => {
        // On récupère le template
        let template = document.getElementById('template-tagOption');

        // On crée une nouvelle copie
        let newTag = document.importNode(template.content, true);

        // On change les valeurs
        newTag.querySelector('option').setAttribute('value', tagId);
        newTag.querySelector('option').setAttribute('name', name);
        newTag.querySelector('option').setAttribute('backgroundColor', backgroundColor);
        newTag.querySelector('option').setAttribute('textColor', textColor);
        newTag.querySelector('option').textContent = name;

        // On insère le tag dans le DOM
        document.getElementById('editTagList').appendChild(newTag);
    },

    makeDeleteTagListInDOM : (tagId, name) => {
        // On récupère le template
        let template = document.getElementById('template-tagOption');

        // On crée une nouvelle copie
        let newTag = document.importNode(template.content, true);

        // On change les valeurs
        newTag.querySelector('option').setAttribute('value', tagId);
        newTag.querySelector('option').textContent = name;

        // On insère le tag dans le DOM
        document.getElementById('deleteTagList').appendChild(newTag);
    },

    makeListInDOM: (listId, name) => {
        // On récupère le template
        let template = document.getElementById('template-list');

        // On le clone
        let newList = document.importNode(template.content, true);

        // On change les valeurs
        newList.querySelector('h2').textContent = name;
        newList.querySelector('.list').setAttribute('data-list-id', listId);

        // On ajoute les évènements
        newList.querySelector('.button--add-card').addEventListener('touchstart', app.showAddCardModal);
        newList.querySelector('.button--delete-list').addEventListener('touchstart', app.deleteListFromDOM);
        newList.querySelector('.button--edit-list').addEventListener('touchstart', app.showEditListForm);
        newList.querySelector('form').addEventListener('submit', app.handleEditListForm);

        // On ajoute le contenu permettant le drag & drop
        const container = newList.querySelector('.panel-block');
        new Sortable (container, {
            group: 'card',
            draggable: '.box',
            animation: 150,
            onEnd: app.handleDropCard
        });

        // On insére la liste dans le DOM
        document.getElementById('lists').appendChild(newList);
    },

    makeCardInDOM: (cardId, name, backgroundColor, textColor, listId) => {
        // On récupère le template
        let template = document.getElementById('template-card');

        // On le clone
        let newCard = document.importNode(template.content, true);

        // On change les valeurs
        newCard.querySelector('.card-name').textContent = name;
        newCard.querySelector('.card').setAttribute('data-card-id', cardId);
        newCard.querySelector('.card').setAttribute('style', 'background-color: ' + backgroundColor + '; color: ' + textColor);
        newCard.querySelector('input[name="background_color"]').value = backgroundColor;
        newCard.querySelector('input[name="text_color"]').value = textColor;

        // On ajoute les évènements
        newCard.querySelector('.button--delete-card').addEventListener('touchstart', app.deleteCardFromDOM);
        newCard.querySelector('.button--edit-card').addEventListener('touchstart', app.showEditCardForm);
        newCard.querySelector('form').addEventListener('submit', app.handleEditCardForm);
        newCard.querySelector('.button--add-tag').addEventListener('touchstart', app.showAddTagToCardModal);

        // On insère la carte dans le DOM
        document.querySelector(`[data-list-id="${listId}"]`).querySelector('.panel-block').appendChild(newCard);
    },

    makeTagInDOM: (tagId, name, backgroundColor, textColor, cardId) => {
        // On récupère le template
        let template = document.getElementById('template-tag');

        // On le clone
        let newTag = document.importNode(template.content, true);

        // On change les valeurs
        newTag.querySelector('span').textContent = name;
        newTag.querySelector('.control').setAttribute('data-tag-id', tagId);
        newTag.querySelector('span').setAttribute('style', 'background-color: ' + backgroundColor + '; color: ' + textColor);

        // On ajoute les évènements
        newTag.querySelector('.is-delete').addEventListener('touchstart', app.deleteTagFromDOM);

        // On insère le tag dans le DOM
        document.querySelector(`[data-card-id="${cardId}"]`).querySelector('.is-grouped-multiline').appendChild(newTag);
    },

    makeListsDroppable: () => {
        // On ajoute le contenu permettant le drag & drop
        const container = document.getElementById('lists');
        new Sortable (container, {
            group: 'list',
            draggable: '.list',
            animation: 150,
            onEnd: app.handleDropList
        });
    },

    updateAllLists: (lists) => {
        try {
            // Pour chaque liste reçue, on boucle
            lists.forEach ( async (list, position) => {
                // On récupère l'id de la liste
                const listId = list.getAttribute('data-list-id');

                // On crée un formulaire que l'on stocke dans data
                let data = new FormData();

                // On intègre une donnée aux data
                data.set ('position', position);

                // On fait la requête à l'API
                let response = await fetch (app.base_url + '/lists/' + listId, {
                    method: 'PATCH',
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: data
                });

                if (response.status !== 200) {
                    // Si une erreur survient, on la récupère et on l'envoie au catch
                    let error = await response.json();
                    throw error;
                } else {
                    // Si tout va bien, on récupère la liste
                    let list = await response.json();
                }
            });
        }

        catch (error) {
            console.trace(error);
        }
    },

    updateAllCards: (cards, listId) => {
        try {
            // Pour chaque carte reçue, on boucle
            cards.forEach ( async (card, position) => {
                // On récupère l'id de la carte
                const cardId = card.getAttribute('data-card-id');
                
                // On crée un formulaire que l'on stocke dans data
                let data = new FormData();
    
                // On intègre des données aux data
                data.set('position', position);
                data.set('list_id', listId);
    
                // On fait la requête à l'API
                let response = await fetch (app.base_url + '/cards/' + cardId, {
                    method: 'PATCH',
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: data
                });
    
                if (response.status !== 200) {
                    // Si une erreur survient, on la récupère et on l'envoie au catch
                    let error = await response.json();
                    throw error;
                } else {
                    // Si tout va bien, on récupère la carte
                    let card = await response.json();
                }
            });
        }

        catch (error) {
            console.trace(error);
        }
    },

    deleteTableFromDOM: async () => {
        try {
            // On récupère l'id
            let tableId = document.querySelector('.section').getAttribute('data-table-id');

            // On récupère l'élément ciblé
            let tableElement = document.querySelector(`a[data-table-id="${tableId}"]`);

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/tables/' + tableId, {
                method: 'DELETE',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère le tableau
                let table = await response.json();

                // On supprime le tableau
                tableElement.parentNode.removeChild(tableElement);

                // On redigirige sur le menu du kanban
                location = '/kanban';
            }
        }

        catch (error) {
            alert('Impossible de supprimer la table');
            console.trace(error);
        }
    },

    deleteListFromDOM: async (event) => {
        try {
            // On récupère l'élément ciblé
            let listElement = event.target.closest('.list');

            // On récupère l'id
            let listId = listElement.getAttribute('data-list-id');
    
            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/lists/' + listId, {
                method: 'DELETE',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });
    
            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère la liste
                let list = await response.json();

                // On la supprime
                listElement.parentNode.removeChild(listElement);
            }
        }

        catch (error) {
            alert('Impossible de supprimer la liste');
            console.trace(error);
        }
    },

    deleteCardFromDOM: async (event) => {
        try {
            // On récupère l'élément ciblé
            let cardElement = event.target.closest('.card');

            // On récupère l'id
            let cardId = cardElement.getAttribute('data-card-id');

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/cards/' + cardId, {
                method: 'DELETE',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère la carte
                let card = await response.json();

                // On la supprime
                cardElement.parentNode.removeChild(cardElement);
            }
        }

        catch (error) {
            alert('Impossible de supprimer la carte');
            console.trace(error);
        }
    },

    deleteTagFromDOM: async (event) => {
        try {
            // On récupère l'élément ciblé
            let tagElement = event.target.closest('.control');

            // On récupère son id
            let tagId = tagElement.getAttribute('data-tag-id');

            // On récupère l'id de la carte
            let cardId = event.target.closest('.card').getAttribute('data-card-id');

            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/cards/' + cardId + '/tags/' + tagId, {
                method: 'DELETE',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère la carte
                let card = await response.json()

                // On supprime le tag
                tagElement.parentNode.removeChild(tagElement);
            }
        }

        catch (error) {
            alert('Impossible de supprimer le tag de la carte');
            console.trace(error);
        }
    },

    showCreatedtable: (tableId, name, backgroundColor) => {
            // On vide les listes existantes
            document.getElementById('lists').textContent = '';

            // On définit la couleur de fond du body
            document.body.style.backgroundColor = backgroundColor;

            // On définit les noms du tableau dans la barre de navigation
            document.querySelector('#editTableModal input[name="name"]').value = name;
            document.querySelector('.navbar-link').textContent = name;

            // On définit la couleur de fond dans l'input du formulaire
            document.querySelector('#editTableModal input[name="background_color"]').value = backgroundColor;

            // On définit les attributs
            document.getElementById('table').setAttribute('data-table-id', tableId);
            document.querySelector('section').setAttribute('data-table-id', tableId);

            // On récupère tous les boutons cachés
            let buttons = document.querySelectorAll('.button.is-hidden');

            // On les affiche
            if (buttons) {
                for (let button of buttons) {
                    button.classList.remove('is-hidden');
                }
            }
    },

    showClickedTable: async (event) => {
        try {
            // On vide les listes existantes
            document.getElementById('lists').textContent = '';

            // On récupère l'élément ciblé
            let tableElement = event.target.closest('a');

            // On récupère l'id
            let tableId = tableElement.getAttribute('data-table-id');
    
            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/tables/' + tableId, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });
    
            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère le tableau contenant les listes, cartes et tags
                let table = await response.json();

                // On définit la couleur de fond du body
                document.body.style.backgroundColor = table.background_color;

                // On définit les noms du tableau dans la barre de navigation
                document.querySelector('#editTableModal input[name="name"]').value = table.name;
                document.querySelector('.navbar-link').textContent = table.name;

                // On définit la couleur de fond dans l'input du formulaire
                document.querySelector('#editTableModal input[name="background_color"]').value = table.background_color;

                // On définit les attributs
                document.getElementById('table').setAttribute('data-table-id', table.id);
                document.querySelector('section').setAttribute('data-table-id', table.id);

                // On récupère tous les boutons cachés
                let buttons = document.querySelectorAll('.button.is-hidden');

                // On les affiche
                for (let button of buttons) {
                    button.classList.remove('is-hidden');
                }

                // Tri des listes en fonction de leur position
                table.lists.sort((a, b) => {
                    return a.position - b.position;
                });

                // On crée les listes, les cartes et les tags
                for (let list of table.lists) {
                    app.makeListInDOM(list.id, list.name);

                    if (list.cards) {
                        // Tri des cartes en fonction de leur position
                        list.cards.sort((a, b) => {
                            return a.position - b.position;
                        });

                        for (let card of list.cards) {
                            app.makeCardInDOM(card.id, card.name, card.background_color, card.text_color, list.id);

                            if (card.tags) {
                                for (let tag of card.tags) {
                                    app.makeTagInDOM(tag.id, tag.name, tag.background_color, tag.text_color, card.id);
                                }
                            }
                        }
                    }
                }
            }
        }

        catch (error) {
            alert('Impossible de charger le tableau');
            console.trace(error);
        }
    },

    getTablesFromAPI: async () => {
        try {
            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/userTables', {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère les tableaux
                let tables = await response.json();

                // On crée les tableaux
                for (let table of tables) {
                    app.makeTableListInDOM(table.id, table.name, table.background_color);
                }
            }
        }

        catch (error) {
            alert('Impossible de charger les tableaux depuis l\'API');
            console.trace(error);
        }
    },

    getTagsFromAPI: async () => {
        try {
            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/userTags', {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on récupère les tags
                let tags = await response.json();

                // On crée les tags dans les trois listes
                for (let tag of tags) {
                    app.makeAddTagListInDOM(tag.id, tag.name);
                    app.makeEditTagListInDOM(tag.id, tag.name, tag.background_color, tag.text_color);
                    app.makeDeleteTagListInDOM(tag.id, tag.name);
                }
            }
        }

        catch (error) {
            alert('Impossible de charger les tags depuis l\'API');
            console.trace(error);
        }
    },

    disconnectFromApp: async () => {
        try {
            // On fait la requête à l'API
            let response = await fetch (app.base_url + '/disconnect', {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (response.status !== 200) {
                // Si une erreur survient, on la récupère et on l'envoie au catch
                let error = await response.json();
                throw error;
            } else {
                // Si tout va bien, on recupère le message
                let message = await response.json();
                location = '/login';
            }
        }

        catch (error) {
            console.trace(error);
        }
    },

    addResponsiveBurgerEvent: () => {
        // On récupère le burger et on lui ajoute un event
        document.querySelector('.navbar-burger').addEventListener('touchstart', () => {
            // On ajoute la classe "is-active" sur les deux élements
            document.querySelector('.navbar-burger').classList.toggle('is-active');
            document.querySelector('.navbar-menu').classList.toggle('is-active');
        });
    }
};

// On crée un évènement qui se déclenchera au chargement du DOM
document.addEventListener('DOMContentLoaded', app.init);