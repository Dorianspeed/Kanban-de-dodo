const loginMiddleware = (request, response, next) => {
    if (!request.session.user) {
        response.redirect('./login.html');
    } else {
        next();
    }
};

module.exports = loginMiddleware;