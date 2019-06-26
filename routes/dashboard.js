const express = require('express');
const router = express.Router();


//book model
const Book = require('../models/Book');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/dashboard", function(req, res) {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Book.find({ $or: [{ name: regex }, { author: regex }, { genre: regex }] }, function(err, allBooks) {
            if (err) {
                console.log(err);
            } else {
                if (allBooks.length < 1) {
                    noMatch = "No books match that query, please try again.";
                }
                res.render('dashboard', { books: allBooks, noMatch: noMatch });
                console.log("yes")
            }
        });
    } else {
        // Get all campgrounds from DB
        Book.find({ name: "" }, function(err, allBooks) {
            if (err) {
                console.log(err);
            } else {
                res.render('dashboard', { books: allBooks, noMatch: noMatch });

            }
        });
    }
});









module.exports = router;