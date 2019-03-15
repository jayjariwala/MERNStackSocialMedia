
// Get the environment variables
require('dotenv').config({ path: 'variables.env'});

//connect the database
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});
mongoose.Promise = global.Promise; // tell mongoose to use ES6 Promise
mongoose.connection.on('error', (err) => {
    console.error(` 🙅‍❌ 🙅‍❌ 🙅‍❌ 🙅‍❌ ${err.message}`);
});

//Run the application
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Express server running -> PORT ${server.address().port}`)
})