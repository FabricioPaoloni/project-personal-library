/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const bookModel = require('../models');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      try {
        let bookArray = await bookModel.find({});
        res.json(bookArray);
        //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]  
      } catch (err) {
        res.json({ error: err });
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!req.body.title) {
        return res.send('missing required field title');
      }
      let findBook = await bookModel.findOne({ title: req.body.title });
      if (findBook) {
        return res.json({
          _id: findBook._id,
          title: findBook.title,
          note: 'book already added'
        })
      }
      let newBook = new bookModel({ title: req.body.title });
      try {
        await newBook.save()
          .then(savedBook => {
            res.json({
              _id: savedBook._id,
              title: savedBook.title
            })
          })
      } catch (err) {
        res.json({ error: err });
      }

      //response will contain new book object including atleast _id and title
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
        await bookModel.deleteMany({}).then(function(deleteAll){
          console.log(deleteAll);
          return res.send('complete delete successful');
        }).catch(function(err){
          console.error('An error has ocurred while deleting all books. Error: ' + err);
          return res.send('An error has ocurred while deleting all books.');
        })
        

        //bug no detectado: no devuelve el res.send ¿Por qué?

        
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
