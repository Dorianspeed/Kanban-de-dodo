require('dotenv').config();
const express = require('express');
const router = require('./app/router');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});