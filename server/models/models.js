var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose');

//MODEL FOR TOKEN
var tokenSchema = new Schema({
    userId: String,
    token: String,
    createdAt: Date
})
var Token = mongoose.model('Token', tokenSchema)

//MODEL FOR CLUB
var clubSchema = new Schema({
  username: String,
  password: String
})
var Club = mongoose.model('Club', clubSchema)

//MODEL FOR RECEIPT
var receiptSchema = new Schema({
  name: String,
  dateCreated: String,
  reqBy: String,
  amount: String,
  imageLink: String
})
var Receipt = mongoose.model('Receipt', receiptSchema)

var studentSchema = new Schema({
  studentName: String,
  password: String
})
var Student = mongoose.model('Student', studentSchema)

module.exports = {
  Club: Club,
  Receipt: Receipt,
  Student: Student,
  Token: Token,
}
