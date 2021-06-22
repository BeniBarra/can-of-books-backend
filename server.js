'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

//everything here is identical
//----------------------------------------

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  //this url comes from your app on the auth0 dashboard
  jwksUri: 'https://dev-8t9i1g9e.us.auth0.com/.well-known/jwks.json'
});

// comes from jsonwebtoken documentation
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// database stuff

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});


// database error warnings from the quickstart guide
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('successfully connected to mongo');
});


const Book = require('./models/Book');

//Commenting this out so that we don't cerate useless cats everytime we stop & restart the server
//use the constructor to make an instance
let frontEndBookName = new Book ({
  name: 'Java2021',
  description: 'java textbook',
  status: 'new',
  email: 'johnson33399@gmail.com'
})

//actually save the book data into MongoDB
frontEndBookName.save((err, bookDataFromMongo) => {
  console.log('book data got saved!');
  console.log(bookDataFromMongo);
});



const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello from the lab12 server');
});

//test route: get all the cats
app.get('/allofthebooks', (req, res) => {
  //go to mongodb
  //find all of the cats
  //send them to the user
  Book.find({}, (err, books) => {
    console.log(books);
    res.send(books);
  });
});

app.get('/books', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  //make sure the token was valid
  jwt.verify(token, getKey, {}, function(err, user) {
    if(err) {
      res.status(500).send('invalid token');
    } else {
      //find the books that belong to the user with that email address
      let userEmail = user.email;
      Book.find({email: userEmail}, (err,books) => {
        console.log(books);
        res.send(books);
      });
    }
  });
});



app.get('/test-login', (req, res) => {
  // TODO: 
  // STEP 1: get the jwt from the headers
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
  // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, getKey, {}, function (err,user) {
    if(err) {
      res.status(500).send('invalid token');
    } else {
      res.send(user);
    }
  })
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
