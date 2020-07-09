const isLoggedInMiddleware = (request, response, next) => {
    if (request.session.user && request.path === '/kanban') {
        next ();
    } else if (request.session.user && request.xhr) {
        next();
    } else if (request.session.user) {
        response.redirect('/kanban');
    } else {
        next();
    }
};

// Exportation du module
module.exports = isLoggedInMiddleware;