const mongoose = require('mongoose');
//set up the data model/template
const bookSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: String,
    email: String
  })

  const Book = mongoose.model('Book', bookSchema);

  module.exports = Book;