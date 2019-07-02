const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Book = require('../models/Book');
const transaction=require('../models/transaction');
const lendDetail=require('../models/lendDetail')
//const fetch=require('node-fetch')

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
           lend,
           email:req.user.email,
           Phn_no:req.user.number
   
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
        OriginalEmail:req.user.email,
        CurrentEmail:req.user.email,
        Phn_no:req.user.number
        //email:req.params.email

       });
       //save  book to database

       newBook.save()
       .then(book =>{
           var d=new Date();
            const newLendDetail = new lendDetail({
                Owner:req.user.email,
                books:book._id,
                Persons_Taken:[req.user.email],
                date_Array:[d]
            })

            newLendDetail.save()
            .then(nld=>{
                console.log(nld.Persons_Taken)
                console.log(nld.date_Array)
                res.redirect('/dashboard');
            })
            .catch(err=> console.log(err));
           
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