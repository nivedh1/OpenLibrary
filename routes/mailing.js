const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const transaction=require('../models/transaction');


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers('{{', '}}'); 


router.get("/request/:id", function(req, res) {
    Book.findOne({_id:req.params.id},function(err,foundBook){
        if(err){
            console.log(err);
        }
        else{
            const msg = {
            to:'rkshest111@gmail.com',
            from:'openlib@openlib.com',
            subject: 'Request of book ',
            text: 'Do not reply',
            html:'<h3>Do not reply ,this is an auto generated mail</h3>',
            templateId:'898e6935-7eab-40c7-850e-22cfddfa69fc',
            substitutions:{
                bookName:foundBook.name,
                author:foundBook.author,
                method:foundBook.lend,
                edition:foundBook.edition,
                genre:foundBook.genre,
                subject:foundBook.subject,
                name:req.user.name,
                email:req.user.email,
                phone:req.user.Phn_no,
            },
        };
            sgMail.send(msg);
            res.send(`${req.user.email}   ${foundBook.CurrentEmail}`)
        }
    });

});

module.exports = router