'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.use(express.json());

//everything here is identical
//----------------------------------------

let bookHandlers = require('./bookHandlers');

// database stuff
const MONGODB_URI=process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

const mongoose = require('mongoose');
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});


// database error warnings from the quickstart guide
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('successfully connected to mongo');
});

// we don't need this anymore unless we need to see data
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
  res.send('Hello from the lab14 server');
});


//test route: get all the books
app.get('/allofthebooks', bookHandlers.allOfTheBooks);


app.get('/books', bookHandlers.findBooksByEmail);


app.post('/books', bookHandlers.addBook);


app.put('/books/:id', bookHandlers.updateBook);


//the :id in the path means that part of the URL is a parameter
app.delete('/books/:id', bookHandlers.deleteBook);



app.listen(PORT, () => console.log(`listening on ${PORT}`));


//test code(we don't need for this lab14):
// app.get('/test-login', (req, res) => {
//   // TODO: 
//   // STEP 1: get the jwt from the headers
//   // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
//   // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
//   // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end

//   const token = req.headers.authorization.split(' ')[1];

//   jwt.verify(token, getKey, {}, function (err,user) {
//     if(err) {
//       res.status(500).send('invalid token');
//     } else {
//       res.send(user);
//     }
//   })
// })

// app.post('/test', (req, res) => {
//   console.log('at the test route');
//   res.send('so happy we are on the test route, good job fellows');
// });
