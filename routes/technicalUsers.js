const express = require('express');
const router = express.Router();
const bcrypt  = require('bcryptjs');
<<<<<<< HEAD
const {ensureAuthenticated}=require('../config/auth');
=======
const {ensureAuthenticated}=require('../config/auth')
>>>>>>> 6e66dab2192f5a261bfea585c2a78e6c17767fe3
const passport = require('passport');

//artcle model
let Article = require('../models/articles');
let TechnicalUser = require('../models/TechnicalUser');

router.get('/login',(req,res)=>res.render('technicalLogin'));
<<<<<<< HEAD
router.get('/form',ensureAuthenticated,(req,res)=>res.render('form'));
=======

router.get('/technicalindex',ensureAuthenticated,(req,res)=>{
    Article.find({},(err,articles)=>{
        if(err){
            console.log(err);
            return;
        }else{
            res.render('technicalindex',{
                title: 'Articles',
                articles: articles
            });
        }
    });
});

router.get('/technicalindex/add_articles',(req,res)=>{
       
    res.render('add_articles', {
        title: 'Add Article'

    });
});


// add post route
router.post('/technicalindex/add_articles', (req, res) => {
    // res.send('OK');
    // console.log('inside post route');
    let article = new Article();
    article.title = req.body.title;
    article.Author = req.body.author;
    article.Category = req.body.category;
    article.Body = req.body.step;
    // articlesteps = article.steps;
    
    article.save((err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/technicalUsers/technicalindex');
        }
    })

    // console.log('articlesteps'+articlesteps);
});
>>>>>>> 6e66dab2192f5a261bfea585c2a78e6c17767fe3

router.post('/login',(req,res,next)=>{
    passport.authenticate('technical-local',{
        successRedirect:'/technicalUsers/technicalindex',
        failureRedirect:'/technicalUsers/login',
        failureFlash:true
    })(req,res,next);
});
// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/technicalUsers/login');
});


module.exports = router;