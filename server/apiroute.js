var express = require('express')
var router = express.Router()
var passport = require('passport')
var LocalStrategy = require('passport-local')
var models = require('./models/models')
var Club = models.Club
var Token = models.Token
var Receipt = models.Receipt
var Student = models.Student

receiptController = require('./controllers/receiptController'),
clubauthController = require('./controllers/clubauthController'),
studentauthController = require('./controllers/studentauthController'),

//REGISTERCLUB
router.post('/registerClub', clubauthController.registerClub);

//REGISTERSTUDENT
router.post('/registerstudent', studentauthController.registerStudent);

//RECEIPTS
router.post('/uploadImage', receiptController.uploadImage);
router.post('/uploadForm', receiptController.uploadForm);



// Middleware setup
// router.use(passport.initialize());
// router.use(passport.session());

// PASSPORT LOCALSTRATEGY HERE

  router.use(passport.initialize());
  router.use(passport.session());

  passport.use(new LocalStrategy(
    function(username, password, done) {
      Club.findOne({ username: 'max' }, function(err, user) {
        console.log('FOUND', user)
        if (!user) {
          return done(null, false, { message: 'Incorrect credentials.' });
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect credentials.' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Club.findOne({
      where: {
        'id': id
      }
    }).then(function (club) {
      if (club == null) {
        done(new Error('Wrong user id.'));
      }
      done(null, club);
    });
  });

// // LOGIN CLUB
router.post('/loginClub', passport.authenticate('local'), function(req, res) {
      req.session.loggedIn = true
      res.json({ success: true })
})




  // router.post('/users/loginclub', function(req,res) {
  //   var login = {
  //     clubName: req.body.clubName,
  //     password: req.body.password
  //   }
  //
  //   Club.find(login, function(err, clubs) {
  //     //RESPOND TO CLIENT
  //     if(clubs.length>0) {
  //       res.json({
  //         success: true,
  //         response: {
  //           token: clubs[0].clubName + new Date(),
  //           id: clubs[0]._id
  //         }
  //       })
  //       //SAVE TOKEN
  //       var newToken = new Token ({
  //         userId: clubs[0]._id,
  //         token: clubs[0].clubName + new Date(),
  //         createdAt: Date.now()
  //       })
  //       newToken.save(function(err, usr){
  //         if(err){
  //           res.json({failure: "database error"})
  //         } else {
  //           res.json({success: true})
  //         }
  //       })
  //     }
  //   else {
  //       res.json({
  //         success: false,
  //         error: "Invalid Login"
  //       })
  //   }
  // })




  module.exports = router
