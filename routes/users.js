const express = require('express');
const router = express.Router();
const bcrypt  = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//Login Page
router.get('/login',(req,res)=>res.render('login'));

//Register Page
router.get('/register',(req,res)=>res.render('register'));

//Welcome Page
router.get('/welcome',(req,res)=>res.render('welcome'));


//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
  } else {
      // Validation passed
      User.findOne({email:email})
        .then(user => {
            if(user){
                errors.push({msg:"Email is alerady registered"});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                  });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                //Hash password
                bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        //Set password to hash
                        newUser.password =hash;
                        //Save the User
                        newUser.save()
                            .then(user=>{
                                req.flash('success_msg','You are now registered');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }))
                }
            
        });

  }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/users/welcome',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;