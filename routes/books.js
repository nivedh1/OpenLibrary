const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
//book model
const Book = require('../models/Book');


//add
router.get('/add/:email',ensureAuthenticated,(req,res) => res.render ('books',{
        user:req.user
    })
);

//delete
router.get('/delete/:id',ensureAuthenticated,function(req,res){
    var id = req.params.id;
    Book.findOneAndRemove({_id:id},function(err){
      if(err){
        console.log(err);
        return res.status(500).send();
      }
      return res.redirect('/dashboard/');
    });
  
  });

//bookdetails
router.get('/infobook/:email',ensureAuthenticated,(req,res) => {
    const resultarray = [];
    Book.find({email: req.params.email}, (err, mybook)=> {
        //console.log("my book is "+mybook[0]);
        for(var i=0;i<mybook.length;i++){
        resultarray.push(mybook[i]);
        }
        res.render ('infobook',{
            user:req.user,
            book:resultarray
        });
        
    })
    
    

});



//add handle
router.post('/add/:email',(req,res)=>{
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
   console.log("experiment "+Book.name);

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
        lend,
        email:req.params.email

       });
       //save  book to database

       newBook.save()
       .then(book =>{
           res.redirect('/dashboard');
       })
       .catch(err=> console.log(err));

       //console.log(newBook)
       
   }
});

//recent added
router.get('/recent', (req, res) => {
    var date1= new Date(req.params.date);
    var date2 = new Date().getTime();
    var resultarray = [];
  
    Book.find({date:{$gt:date2/(1000 * 60 * 60 * 24)-30}},function(err,mybook){
      console.log(mybook);
         
      for(var i=0;i<mybook.length;i++){
      resultarray.push(mybook[i]);
      }
      res.render ('recent_added',{
        user:req.user,
        book:resultarray
      });
    
    });
  });
module.exports = router;