const express = require('express');
const expressLayouts= require('express-ejs-layouts');
const mongoose = require ('mongoose');



const app= express ();

//DB config

const db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
.then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//EJS

app.use(expressLayouts);

//Bodyparser


app.use(express.urlencoded({ extended: false}));

app.set('view engine', 'ejs');

//Routes

app.use('/', require('./routes/index'));
app.use('/books',require('./routes/books'));

const PORT = process.env.PORT || 5000;

app.listen(PORT ,console.log('server started on port ${PORT}'));