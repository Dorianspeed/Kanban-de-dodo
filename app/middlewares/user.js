const userMiddleware = (request, response, next) => {
    if (request.session.user) {
        response.locals.user = request.session.user;
    } else {
        response.locals.user = false;
    }

    next();
};

module.exports = userMiddleware;