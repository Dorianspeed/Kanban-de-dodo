const isLoggedOutMiddleware = (request, response, next) => {
    if (!request.session.user) {
        response.redirect('/login');
    } else {
        next();
    }
};

// Exportation du module
module.exports = isLoggedOutMiddleware;