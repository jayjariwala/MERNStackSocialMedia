const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const post = require('./routes/api/post');
const users =  require('./routes/api/users');
const profile = require('./routes/api/profile');

const app = express();

//Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose.connect(db, {useNewUrlParser: true});

//Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', post);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on ${port}`));