const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const passport = require('passport');

//set all the middlewares

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//passport middlweware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

//all the routes
app.use('/api/users', users);
app.use('/api/profile', profile);


module.exports = app;