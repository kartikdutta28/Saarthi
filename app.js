const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/keys');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');

//Passport Config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').MongoURI;


//Set public folder for static files
app.use('/public', express.static(path.join(__dirname, '/public')));


//PORT variable
const PORT = process.env.PORT || 5000;

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Parse application
app.use(bodyParser.urlencoded({
    extended: false
}));
//app.use(bodyParser.json());

//Express session middle ware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Express messages middleware
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/technicalUsers', require('./routes/technicalUsers'));
// app.use('/technical',require('./routes/technical'));
// app.use('/admin',require('./routes/admin'));

//Listen to port 5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    //Connect to Mongo
    mongoose.connect(db, {
            useNewUrlParser: true
        })
        .then(() => console.log('MongoDB Connected....'))
        .catch(err => console.log(err));

});