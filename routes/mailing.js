const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const transaction=require('../models/transaction');


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



router.get("/request/:id", function(req, res) {
    Book.findOne({_id:req.params.id},function(err,foundBook){
        if(err){
            console.log(err);
        }
        else{
            const msg = {
            to:'nivedh@iitk.ac.in',
            from:req.user.email,
            subject: 'Request of book ',
            text: 'hugy',
            html: '<strong> You have been requested the book <%= foundBook.name%> </strong>',
            };
            sgMail.send(msg);
            res.send(`${req.user.email}   ${foundBook.CurrentEmail}`)
        }
    });

});

module.exports = router