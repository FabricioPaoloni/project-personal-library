const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    comments: {
        type: Array,
        default: []
    }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
