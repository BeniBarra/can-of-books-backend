'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors());

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

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello from the lab11 server');
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
