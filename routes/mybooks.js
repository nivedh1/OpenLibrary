const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const transaction=require('../models/transaction');
const lendDetail=require('../models/lendDetail')

router.get('/infobook/:email',ensureAuthenticated,(req,res) => {
    var resultarray = [];
    Book.find({OriginalEmail: req.params.email}, function (err, mybook) {
      // console.log("my book is "+mybook[0].name);
      //console.log(mybook)
        for(var i=0;i<mybook.length;i++){
            
                if((mybook[i])&&(mybook[i].OriginalEmail==mybook[i].CurrentEmail)){
                resultarray.push(mybook[i]);

            }
        }
        var NoMatch=null;
        if(resultarray.length<1){
            NoMatch='No Books have been added'
        }
        res.render ('infobook',{
            user:req.user,
            book:resultarray,
            NoMatch:NoMatch
        })
   // Book.findByIdAndUpdate(req.query.book,{$set:{}})
var d=new Date();
 
    if(req.query.email){

        Book.findByIdAndUpdate(req.query.book,{$set:{CurrentEmail:req.query.email}},(err,book)=>{
            if(err){
                console.log(err)
            }else{
                //lendDetail.find({books:book._id},(err,ld)=>{
                    lendDetail.findOneAndUpdate({
                        books:req.query.book
                    },{"$push" :{"Persons_Taken":req.query.email,"date_Array":d}},(function(err,ld){
                        if(err){
                            console.log(err)
                        }else{
                            
                            console.log(`person array is ${ld.Persons_Taken} and date array is ${ld.date_Array}`)
                           // console.log(ld.date_Array)
                            console.log("hi")
                        }
                    }))

            }
        })

        
    }
    })
});



router.get('/sharedBooks/:email',ensureAuthenticated,(req,res)=>{
    Book.find({
        OriginalEmail:req.params.email
    },(err,book)=>{
        var NoMatch=null;
        var bookArray=[];
        for(var i=0;i<book.length;i++){
            if(book[i]&&(book[i].CurrentEmail!==req.params.email)){

                bookArray.push(book[i])
            }
        }
        if(bookArray.length<1){
            NoMatch="No books have been shared"
        }
        res.render('sharedBooks',{
            user:req.user,
            book:bookArray,
            NoMatch:NoMatch
        })
    })
})

router.get('/sharedBooks/bookInfo/:email/:id',ensureAuthenticated,(req,res)=>{
    lendDetail.findOne({books:req.params.id}).populate('books').exec((err,fld)=>{
        //console.log(fld)
       
        console.log(fld.date_Array)
        console.log(fld.Persons_Taken)
        res.render('sharedInfo',{
            user:req.user,
            fld:fld
        })
    })
})

router.get('/borrowedBooks/:email',ensureAuthenticated,(req,res)=>{
    Book.find({CurrentEmail:req.params.email},(err,book)=>{
       var bookArray=[];
       var NoMatch=null;
       
        for(var i=0;i<book.length;i++){
            if(book[i].OriginalEmail!==req.params.email){
                bookArray.push(book[i]);
            }
        }
        if(bookArray.length<1){
            NoMatch='No books Borrowed'
        }
        res.render('borrowedBooks',{
            user:req.user,
            book:bookArray,
            NoMatch:NoMatch
        })
    })
    var d=new Date();
    if(req.query.email){
        var id=req.query.book;
        Book.findByIdAndUpdate(id,{$set:{CurrentEmail:req.query.email}},(err,book)=>{
            if(err){
                console.log(err)
            }else{
                //lendDetail.find({books:book._id},(err,ld)=>{
                    lendDetail.findOneAndUpdate({
                        books:req.query.book
                    },{$set :{"$push" :{"Persons_Taken":req.query.email,"date_Array":d}}},(function(err,ld){
                        if(err){
                            console.log(err)
                        }else{
                            console.log(ld.Persons_Taken)
                        }
                    }))

            }
        })
    }
})

module.exports = router ;