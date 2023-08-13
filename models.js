const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    commentCount: {
        type: Number,
        default: 0
    },
    comment: {
        type: Array,
        default: []
    }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
