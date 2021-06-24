
const Book = require('./models/Book')

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

//------------------------------------------

let allOfTheBooks = (req, res) => {
    //go to mongodb
    //find all of the books
    //send them to the user
    Book.find({}, (err, books) => {
      console.log(books);
      res.send(books);
    });
}

let findBooksByEmail = (req, res) => {
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
};


let addBook = (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    //make sure the token was valid
    jwt.verify(token, getKey, {}, function(err, user) {
      if(err) {
        res.status(500).send('invalid token');
      } else {
        //req.body ONLY exists because of the configuration line at the top of the file
        //don't forget app.use(express.json()) on top
        //otherwise, req.body will be undefined
        console.log(req.body);
        const newBook = new Book({
          name: req.body.name,
          description: req.body.description,
          status: req.body.status,
          //grab the email from the token
          email: user.email
        })
        newBook.save((err, savedBookData) => {
          res.send(savedBookData);
        })
      }
    });
};


let updateBook = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //make sure the token was valid
    jwt.verify(token, getKey, {}, function(err, user) {
      if(err) {
        res.status(500).send('invalid token');
      } else {
        Book.findOne({_id: req.params.id, email: user.email}).then(foundBook => {
            console.log(foundBook);
            //update that book
            foundBook.name = req.body.name;
            foundBook.description = req.body.description;
            foundBook.status = req.body.status;
            foundBook.save().then(savedBook => res.send(savedBook));
            //send back the updated data
        })
      }
    });
};

let deleteBook = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    //make sure the token was valid
    jwt.verify(token, getKey, {}, function(err, user) {
      if(err) {
        res.status(500).send('invalid token');
      } else {
        let bookId = req.params.id;
  
        Book.deleteOne({_id: bookId, email: user.email})
          .then(deletedBookData => {
            console.log(deletedBookData);
            res.send('book successfully deleted!')
          });
      }
    });
;}

module.exports = {
    allOfTheBooks: allOfTheBooks, findBooksByEmail, addBook, updateBook, deleteBook
};

