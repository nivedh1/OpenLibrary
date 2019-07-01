

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }, 
     edition: {
        type: String,
        required: true   
    }, 
     genre: {
        type: String,
        required: true

                    
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lend: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    email:{
        type:String
    },
    owner:{
        type:String,
        required:false
    },
    Phn_no:{
        type:String,
        required:false
    }
})


const Book = mongoose.model('Book',BookSchema)

module.exports = Book;