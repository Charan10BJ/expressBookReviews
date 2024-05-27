const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  for (let user of users) {
    if (( user.username === username ) && ( user.password === password ) ) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const userInput = {
    username : req.body.username,
    password : req.body.password
  };

  const authenticatedUser = this.authenticated(userInput.username, userInput.password);
  if (authenticatedUser) {
    let accessToken = jwt.sign({
      data: userInput
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
    }
    return res.status(200).json({message: "Customer successfully logged in"});
  }
  return res.status(200).json({message: "Login Failed"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.review;
  const isbn = req.params.isbn;

  const {data} = jwt.verify(req.session.authorization.accessToken, 'access');
  
  const book = books[isbn];

  if (book.reviews.hasOwnProperty(data.username)) {
      book.reviews[data.username] = review;
      return res.status(200).json({message: `The review for the book with ISBN ${isbn} has been updated.`});
  } else {
      book.reviews[data.username] = review;
      return res.status(200).json({message: `The review for the book with ISBN ${isbn} has been added.`});
  }
});

regd_users.delete("/auth/delete/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  const {data} = jwt.verify(req.session.authorization.accessToken, 'access');
  const book = books[isbn];

  if (book.reviews.hasOwnProperty(data.username)) {
      delete book.reviews[data.username];
      return res.status(200).json({message: `The review for the book with ISBN ${isbn} has been deleted.`});
  } else {
      return res.status(200).json({message: `The review for the book with ISBN ${isbn} has not been added`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
