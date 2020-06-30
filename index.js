require('dotenv').config();
const express = require('express');
const router = require('./app/router');

const app = express();
const port = process.env.PORT || 5050;

app.use(router);

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});