const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/api/users');

//set all the middlewares

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//all the routes
app.use('/api/users', users);


module.exports = app;