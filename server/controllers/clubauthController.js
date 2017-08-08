var models = require('../models/models')
var Club = models.Club
var Token = models.Token

module.exports.registerClub = function(req, res) {
  console.log(req.body)
  var newClub = new Club ({
    username: req.body.username,
    password: req.body.password,
  })
  newClub.save(function(err, club){
    if(err){
      res.json({failure: "database error"})
    } else {
      res.json({success: true})
    }
  })
}
