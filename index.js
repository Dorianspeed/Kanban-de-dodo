require('dotenv').config();
const express = require('express');
const router = require('./app/router');
const session = require('express-session');
const userMiddleware = require('./app/middlewares/user');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.urlencoded({ extended: true }));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'Le secret du Kanban',
    cookie: {
        secure: false,
        maxAge: (1000*60*60)
    }
}));

app.user(userMiddleware);
app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});