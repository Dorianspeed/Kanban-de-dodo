const loginMiddleware = (request, response, next) => {
    if (!request.locals.user) {
        response.redirect('/login.html');
    } else {
        next();
    }
};

module.exports = loginMiddleware;