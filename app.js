const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/keys');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const Request = require('./models/Request');
let Pusher = require('pusher');

//Models
const article = require('./models/articles');

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

//Get the user through out the website
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use('/', require('./routes/index'));

//Explore route for a user who is not logged in
app.get('/explore',(req,res)=>{
    article.find({},(err,articles)=>{
      if(err){
        console.log(err);
      }else{
        res.render('explore',{
          articles : articles
        })
      }
    })
  });
  //POST route for request an article 
  app.post('/explore',(req,res)=>{
    const newRequest=new Request();
    newRequest.title=req.body.RequestTitle;
    newRequest.email=req.body.RequestEmail;
    newRequest.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.redirect('/explore');
      }
    });
  
  });
  
//GET route for user single article
app.get('/explore/:id', (req, res) => {
  article.findById(req.params.id, (err, article) => {
      if (err) {
          console.log(err);
          return;
      } else {
          res.render('user_article', {
              article: article
          })
      }
  });
});
  
let pusher = new Pusher({
  appId: '713073',
  key: '1c85b3a5edd16467f014',
  secret: 'a6ea4e5a7b60154582f7',
  cluster: 'ap2'
});

app.post('/posts/:id/act', (req, res, next) => {
    const action = req.body.action;
    const counter = action === 'Like' ? 1 : -1;
    article.update({_id: req.params.id}, {$inc: {Likes: counter}}, {}, (err, numberAffected) => {
        pusher.trigger('post-events', 'postAction', { action: action, postId: req.params.id }, req.body.socketId);
        res.send('');
    });
});
app.use('/users', require('./routes/users'));
app.use('/technicalUsers', require('./routes/technicalUsers'));

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