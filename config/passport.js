const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');
const TechnicalUser=require('../models/TechnicalUser');

// let istechnicalUser = (user)=>{
//   TechnicalUser.findOne({email:user.email}, function(err, result) {
//     if (err){throw err} 
//     else{
//       console.log(result.name);
//       return true;
//     }
//   });
// }

// let isUser = (user)=>{
//   User.findOne({email:user.email}, function(err, result) {
//     if (err) throw err;
//     else{
//       console.log(result.name);
//       return true;
//     }
//   });
// }

module.exports = function(passport) {
  passport.use('user-local',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })

  );
  passport.use('technical-local',new LocalStrategy({usernameField:'email'},(email,password,done)=>{
      TechnicalUser.findOne({
        email:email
      }).then(tuser=>{
        if(!tuser){
          return done(null,false,{message:'That email is not registered'});
        }

        return done(null,tuser);
      });
    })
  );
  passport.serializeUser(function(user, done) {
      // if(istechnicalUser(user)){
      //   done(null,tuser.id);
      //   // return;
      // }
      // else if(isUser(user)){
        done(null, user.id); 
        // return;  
      // } 
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
    done(err, user);
    });
    TechnicalUser.findById(id,function(err,tuser){
      done(err,tuser);
    });
  }); 
};

