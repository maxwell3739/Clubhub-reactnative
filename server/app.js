"use strict";

var mongoose = require('mongoose')
var express = require('express')
var bodyParser = require('body-parser')

mongoose.connection.on('error', function() {
  console.log('Oh no! Could not connect to the database')
})
mongoose.connection.on('connected', function() {
  console.log('Yay! Connected to database.')
})

mongoose.connect(process.env.MONGODB_URI);

//express application confirmation
var app = express()
app.use(bodyParser.json())

//require in my routes
var apiroutes = require('./apiroute')
app.use('/api', apiroutes)

//start my server
app.listen(8080, function() {
  console.log('Connected to localhost:8080')
})
