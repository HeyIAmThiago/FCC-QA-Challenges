"use strict";

const Book = require("./bookModel");
require("dotenv").config({ path: "./.env" });

module.exports = function (app) {
  // ---- /api/books ----
  app
    .route("/api/books")
    .get((req, res) => {
      Book.find({}, (err, books) => {
        if (err || !books) return res.json([]);
        const formatted = books.map((b) => ({
          _id: b._id,
          title: b.title,
          commentcount: b.commentcount,
          comments: b.comments || [],
        }));
        return res.json(formatted);
      });
    })
    .post((req, res) => {
      const { title } = req.body;
      if (!title) return res.send("missing required field title");

      new Book({ title, comments: [], commentcount: 0 }).save((err, book) => {
        if (err || !book) return res.send("missing required field title");
        return res.json({ _id: book._id, title: book.title });
      });
    })
    .delete((req, res) => {
      Book.deleteMany({}, (err) => {
        if (err) return res.send("complete delete failed");
        return res.send("complete delete successful"); // string exata do FCC
      });
    });

  // ---- /api/books/:id ----
  app
    .route("/api/books/:id")
    .get((req, res) => {
      const bookid = req.params.id;
      Book.findById(bookid, (err, book) => {
        if (err || !book) return res.send("no book exists"); // string exata
        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments || [],
          commentcount: book.commentcount,
        });
      });
    })
    .post((req, res) => {
      const bookid = req.params.id;
      const { comment } = req.body;

      if (!comment) return res.send("missing required field comment"); // string exata

      Book.findById(bookid, (err, book) => {
        if (err || !book) return res.send("no book exists"); // string exata

        book.comments.push(comment);
        book.commentcount++;

        book.save((err, updatedBook) => {
          if (err) return res.send("could not add comment");
          return res.json({
            _id: updatedBook._id,
            title: updatedBook.title,
            comments: updatedBook.comments,
            commentcount: updatedBook.commentcount,
          });
        });
      });
    })
    .delete((req, res) => {
      const bookid = req.params.id;

      Book.deleteOne({ _id: bookid }, (err, result) => {
        if (err || !result.deletedCount) return res.send("no book exists"); // string exata
        return res.send("delete successful"); // string exata
      });
    });
};
