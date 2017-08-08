var models = require('../models/models')
var Receipt = models.Receipt

module.exports.uploadImage = function(req, res) {
    var newReceipt = new Receipt ({
      name: req.body.filename,
      dateCreated: Date.now(),
      reqBy: null,
      amount: null,
      imageLink: req.body.imageLink,
    })
    newReceipt.save(function(err, receipt){
      if(err){
        console.log("send err")
        res.json({failure: "database error"})
      } else {
        res.json({ success: true })
      }
    })
}

module.exports.uploadForm = function(req, res) {
  Receipt.findOneAndUpdate(
    {name: req.body.filename},
    {  $set:
      {
        reqBy: req.body.reqBy,
        amount: req.body.amount,
      }
    },
      function(err,obj) {
        res.send(obj)
      }
    )
  }
