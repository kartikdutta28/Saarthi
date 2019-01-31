const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/keys');
//const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
//Passport Config
require('./config/passport')(passport);
//DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db,{useNewUrlParser:true})
    .then(()=>console.log('MongoDB Connected....'))
    .catch(err=>console.log(err));

//Set public folder for static files
app.use(express.static(path.join(__dirname,'public')));


//PORT variable
const PORT = process.env.PORT || 5000;
  
//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Parse application
app.use(bodyParser.urlencoded({extended:false}));
//app.use(bodyParser.json());

//Express session middle ware
app.use(session({
    secret:'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Express messages middleware
app.use(flash());

//Global Vars
app.use((req,res,next) => {
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));