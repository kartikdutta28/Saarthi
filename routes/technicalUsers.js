const express = require('express');
const router = express.Router();
const bcrypt  = require('bcryptjs');
const {ensureAuthenticated}=require('../config/auth')
const passport = require('passport');

//artcle model
let Article = require('../models/articles');
let TechnicalUser = require('../models/TechnicalUser');

router.get('/login',(req,res)=>res.render('technicalLogin'));

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


//get single article
router.get('/technicalindex/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.render('article', {
                title: 'articles',
                article: article
            })
        }
    });
});


//edit article
router.get('/technicalindex/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.render('edit_article', {
                title: 'Edit article',
                article: article
            })
        }
    });
});


//update post route
router.post('/technicalindex/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.Category = req.body.category;
    article.Author = req.body.author;
    article.Body = req.body.body;

    let query = {
        _id: req.params.id
    };
    Article.updateOne(query, article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'article updated');
            res.redirect('/technicalUsers/technicalindex');
        }
    })
});


//delete an article
router.get('/technicalindex/delete/:id', (req, res) => {
    let query = {
        _id: req.params.id
    }

    Article.remove(query, (err) => {
        if (err) {
            console.log(err);

        }else{
            res.redirect('/technicalUsers/technicalindex');
        // res.send('success');
        }
        
    })
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
    article.steptitiles = req.body.steptitle;
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

});

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