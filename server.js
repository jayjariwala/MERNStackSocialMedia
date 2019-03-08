const express = require('express');
const mongoose = require('mongoose');
const app = express();
const post = require('./routes/api/post');
const users =  require('./routes/api/users');
const profile = require('./routes/api/profile');


//DB Config
const db = require('./config/keys').mongoURI;

//connect to mongodb
mongoose.connect(db, {useNewUrlParser: true});

app.get('/', (req,res) => res.send('Hello world'));

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', post);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on ${port}`));