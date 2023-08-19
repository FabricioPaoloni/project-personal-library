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
        // console.log(bookArray)
        if (!bookArray.length) {
          return res.json(
            [{
              _id: 'No id',
              title: 'No books in the DB',
              commentcount: 0
            }]
          )
        } else {

          let modifiedBookArray = bookArray.map(data => {
            return {
              "_id": data._id,
              "title": data.title,
              "commentcount": data.comments.length
            }
          })
          res.json(modifiedBookArray);
          //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]  
        }

      } catch (err) {
        res.json({ error: err });
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res.json('missing required field title');
      } else {

        let findBook = await bookModel.findOne({ title: req.body.title });
        if (findBook) {
          return res.json({
            "_id": findBook._id,
            "title": findBook.title
            // note: 'book already added'
          })
        }
        let newBook = new bookModel({ title: req.body.title });
        try {
          await newBook.save()
            .then(savedBook => {
              res.json({
                "_id": savedBook._id,
                "title": savedBook.title
              })
            })
        } catch (err) {
          res.json({ error: err });
        }
      }

      //response will contain new book object including atleast _id and title
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      await bookModel.deleteMany({})
        .then(deletedBooks => {
          // console.log(deletedBooks);
          return res.json('complete delete successful');
        })
        .catch(err => {
          // console.error('An error has ocurred while deleting all books. Error: ' + err);
          return res.send('An error has ocurred while deleting all books.');

        })

      //bug no detectado: no devuelve el res.send ¿Por qué?
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let findBook = await bookModel.findById(bookid);
        if (!findBook) {
          return res.json('no book exists');
        } else {
          return res.json({
            "_id": findBook._id,
            "title": findBook.title,
            "comments": findBook.comments
          })
        }
      } catch (err) {
        // console.error(err);
        return res.json('An error has ocurred while finding the book')
      }


    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.json('missing required field comment');
      }
      try {
        let doc = await bookModel.findById(bookid);
        if (!doc) {
          return res.json('no book exists');
        } else {
          doc["comments"].push(comment);
          await doc.save()
            .then(savedBook => {
              // console.log(res.body);
              res.json({
                "_id": savedBook._id,
                "title": savedBook.title,
                "comments": savedBook.comments
              })
            })
            .catch(err => {
              // console.error(err);
              return res.send('An error has ocurred while saving a new comment.')
            })
        }
      } catch (err) {
        console.error(err);
        return res.send('An error has ocurred while saving a new comment.')
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let findBook = await bookModel.findById(bookid);
      if (!findBook) {
        return res.json('no book exists');
      } else {
        await bookModel.deleteOne({ _id: bookid })
          .then(deletedBook => {
            return res.status(200).json('delete successful');
          })
          .catch(err => {
            // console.error(err);
            return res.json({ error: err });
          })
      }

    });

};
