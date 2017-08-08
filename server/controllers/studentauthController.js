var models = require('../models/models')
var Student = models.Student

module.exports.registerStudent = function(req, res) {
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
}
