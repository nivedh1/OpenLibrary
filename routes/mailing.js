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
                phone:req.user.number,
                user_id:req.user._id,
                book_id:foundBook._id,
            },
        };
            sgMail.send(msg);
            res.send(`${req.user.email}   ${foundBook.CurrentEmail}`)
        }
    });

});
router.get("/reject/:id/:requestorId", function(req, res) {
    Book.findOne({_id:req.params.id},function(err,foundBook){
        if(err){
            console.log(err);
        }
        else{
            user.findById(req.params.requestorId,(err,foundUser)=>{
                    const msg = {
                    to:foundUser.email,
                    from:'openlib@openlib.com',
                    subject: 'Rejection of requested book ',
                    text: 'Do not reply',
                    html:'<h3>Do not reply ,this is an auto generated mail</h3>',
                    templateId:'bb3d532d-3b08-4cbc-84e6-f98703710336',
                    substitutions:{
                        bookName:foundBook.name,
                        author:foundBook.author,
                        method:foundBook.lend,
                        edition:foundBook.edition,
                        genre:foundBook.genre,
                        subject:foundBook.subject,
                        name:req.user.name,
                        email:req.user.email,
                        phone:req.user.number,
                    },
                };
                    sgMail.send(msg);
                    res.send(`${req.user.email}   ${foundBook.CurrentEmail}`)
            });
                }
    });

});

module.exports = router