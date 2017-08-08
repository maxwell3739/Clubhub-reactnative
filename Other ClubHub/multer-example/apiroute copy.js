var express = require('express')
var router = express.Router()
var passport = require('passport')
var models = require('./models/models')
var Club = models.Club
var Token = models.Token
var Receipt = models.Receipt
var Student = models.Student

// import LocalStrategy from

//Middleware setup
// router.use(passport.initialize());
// router.use(passport.session());

//REGISTER CLUB
router.post('/users/registerclub', function(req,res) {
  var newClub = new Club ({
    clubName: req.body.clubName,
    password: req.body.password,
  })
  newClub.save(function(err, club){
    if(err){
      res.json({failure: "database error"})
    } else {
      res.json({success: true})
    }
  })
})

//REGISTER STUDENT
router.post('/users/registerstudent', function(req,res) {
  var newStudent = new Student ({
    studentName: req.body.studentName,
    password: req.body.password,
  })
  newStudent.save(function(err, student){
    if(err){
      res.json({failure: "database error"})
    } else {
      res.json({success: true})
    }
  })
})

// // PASSPORT LOCALSTRATEGY HERE
//   passport.use(new LocalStrategy(
//     function(username, password, done) {
//       Club.findOne({ clubName: username }, function (err, club) {
//         if (err) { return done(err); }
//         if (!club) {
//           return done(null, false, { message: 'Incorrect username.' });
//         }
//         if (club.password !== password) {
//           return done(null, false, { message: 'Incorrect password.' });
//         }
//         return done(null, club);
//       });
//     }
//   ));
//
// // req.user
// // LOGIN CLUB
// router.post('/users/loginclub', passport.authenticate('local', function(req, res) {
//     res.json({
//       success: true,
//       // response: {
//       //   token: clubs[0].clubName + new Date(),
//       //   id: clubs[0]._id
//       // }
//     })
// }))

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
// var upload = multer({ dest: 'uploads/' })


// //UPLOAD
router.post('/upload', upload.single('receipt'), function (req, res) {
  var newReceipt = new Receipt ({
    name: req.file.filename,
    dateCreated: Date.now(),
    uri: req.file.path,
    reqBy: null,
    amount: null,
    imageLink: null,
  })
  newReceipt.save(function(err, receipt){
    if(err){
      console.log("send err")
      res.json({failure: "database error"})
    } else {
      res.json({ filename: req.file.filename })
    }
  })
})

// //UPLOADDATA
router.post('/uploadform', function (req, res) {
  console.log("LINK", req.body.imageLink)
  console.log("FILE", req.body.filename)
  Receipt.findOneAndUpdate(
    {name: req.body.filename},
    {  $set:
      {
        reqBy: req.body.reqBy,
        amount: req.body.amount,
        imageLink: req.body.imageLink
      }
    },
      function(err,obj) {
        console.log("OBJECT", obj)
        res.send(obj)
      }
    )
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
