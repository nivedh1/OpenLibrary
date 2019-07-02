const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const transaction=require('../models/transaction');


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



router.get("/mailing/:id", function(req, res) {
    Book.findOne({_id:req.params.id},function(err,foundBook){
        if(err){
            console.log(err);
        }
        else{
            const msg = {
            to: req.user.email,
            from:foundBook.email,
            subject: 'testing',
            text: 'the mailing feature of node js',
            html: '<strong>Hey great the mailing feature now works</strong>',
            };
            sgMail.send(msg);
            res.send(`${req.user.email}   ${foundBook.email}`)
        }
    });

});
module.exports = router