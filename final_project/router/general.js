const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  if (!req.body?.username) {
    return res.status(300).json({message: "username was not provided"});
  }
  if (!req.body?.password) {
    return res.status(300).json({message: "password was not provided"});
  }

  users.push({
    username: req.body.username,
    password: req.body.password
  });
  
  return res.status(200).json({message: "Customer Successfully regisered. Now you can login"});
});

async function getBooks(callback) {
  callback(null, books);
}

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  await getBooks((err, books) => {
      if (err) {
          console.error(err);
          return res.status(500).json({message: 'Error'});
      }
      return res.status(200).json({books: books});
  });
});

function getBookByIsbn(isbn) {
  return new Promise((resolve, reject) => {
      let book = books[isbn];
      if (book) {
          resolve(book);
      } else {
          reject('Book not found');
      }
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getBookByIsbn(isbn)
    .then( book =>{
      return res.status(200).json(book);
    })
    .catch(err => {
      return res.status(300).json({ message: err });
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let filteredBooks = {};
  for (let key in books) {
    if (books[key].author === req.params.author) {
        filteredBooks[key] = books[key];
    }
  }
  return res.status(200).json({booksbyauthor: filteredBooks});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let filteredBooks = {};
  for (let key in books) {
    if (books[key].title === req.params.title) {
        filteredBooks[key] = books[key];
    }
  }
  return res.status(200).json({booksbytitle: filteredBooks});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const review = books[req.params.isbn].reviews;
  return res.status(300).json({review: review});
});

module.exports.general = public_users;
