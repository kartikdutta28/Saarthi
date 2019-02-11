const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');
const TechnicalUser=require('../models/TechnicalUser');

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}


// let istechnicalUser = (user)=>{
//   TechnicalUser.findOne({email:user.email}, function(err, result) {
//     if (err){throw err} 
//     else{
//       console.log(result.name);
//       return result;
//     }
//   });
// }

// let isUser = (user)=>{
//   User.findOne({email:user.email}, function(err, result) {
//     if (err) throw err;
//     else{
//       console.log(result.name);
//       return result;
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
          return done(null,false,{message:'That email is not registered sorry'});
        }bcrypt.compare(password, tuser.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, tuser);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });

        });
    })
  );
  passport.serializeUser(function(user, done) {
    let userGroup = User;
    let userPrototype = Object.getPrototypeOf(user);

    if(userPrototype === User.prototype){
      userGroup = "User";
    }else if(userPrototype === TechnicalUser.prototype){
      userGroup = "TechnicalUser";
    }

    let sessionConstructor = new SessionConstructor(user.id, userGroup, '');
    done(null,sessionConstructor);
  });

  passport.deserializeUser(function(sessionConstructor, done) {
    // User.findById(id, function(err, user) {
    // done(err, user);
    // });
    // TechnicalUser.findById(id,function(err,tuser){
    //   done(err,tuser);
    // });

    if(sessionConstructor.userGroup == "User"){
      User.findOne({
        _id: sessionConstructor.userId
    },function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
        done(err, user);
    });
    }else if(sessionConstructor.userGroup == 'TechnicalUser'){
      TechnicalUser.findOne({
        _id: sessionConstructor.userId
    },function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
        done(err, user);
    });
    }
  }); 
};
