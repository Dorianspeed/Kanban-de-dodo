const userMiddleware = (request, response, next) => {
    if (request.session.user) {
        localStorage.user = request.session.user;
    } else {
        localStorage.user = false;
    }

    next();
};

module.exports = userMiddleware;