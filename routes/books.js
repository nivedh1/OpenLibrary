const express = require('express');
const router = express.Router();


//book model
const Book = require('../models/Book');
//add
router.get('/books',(req,res) => res.render ('books'));

//add handle
router.post('/books',(req,res)=>{
    const {name, author , edition , genre , subject, description ,lend} =req.body;

    let errors= [];
   
    //check required fields
    if(!name){
        errors.push({msg: 'Please fill in the name'})
    }
    if(!author){
       errors.push({msg: 'Please fill in the author \'s name'})
   }
   if(!edition){
       errors.push({msg: 'Please fill in the edition'})
   }
   if(!lend){
       errors.push({msg: 'Please fill in the lending way'})
   }
   
   if(errors.length>0){
       res.render('books',{
           errors,
           name,
           author,
           edition,
           genre ,
           subject, 
           description ,
           lend
   
       });
   }
   else{
       //adding the book
       const newBook= new Book({
        name,
        author,
        edition,
        genre ,
        subject, 
        description ,
        lend

       });
       //save  book to database

       newBook.save()
       .then(book =>{
           res.redirect('/');
       })
       .catch(err=> console.log(err));

       console.log(newBook)
       
   }
});
module.exports = router;