const error404Middleware = (request, response) => {
    response.status(404).redirect('/404.html');
};

module.exports = error404Middleware;