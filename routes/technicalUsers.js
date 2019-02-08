const express = require('express');
const router = express.Router();
const bcrypt  = require('bcryptjs');
const passport = require('passport');

router.get('/login',(req,res)=>res.render('technicalLogin'));
router.get('/form',(req,res)=>res.render('form'));

router.post('/login',(req,res,next)=>{
    passport.authenticate('technical-local',{
        successRedirect:'/technicalUsers/form',
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