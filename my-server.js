const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');

//Create express app
const app = express();

//Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Parse requests of content-type - application/json
app.use(bodyParser.json());

//Database config
const db = require('./config/db.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Connecting to the database
mongoose.connect(db.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

// session
app.use(session({
    secret: 'uditha',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }));

//Define Routes
app.get('/', (req, res) => {
    res.json({message: "Welcome mini-project"});
});

require('./app/routes/post.routes.js')(app);
require('./app/routes/user.routes.js')(app);
require('./app/routes/auth.routes.js')(app);



//Listen for requests
app.listen(6000, () => {
    console.log("Server is listening on port 6000");
});