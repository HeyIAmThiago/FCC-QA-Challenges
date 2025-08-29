const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let id;

suite("Functional Tests", function () {
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "new book title" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "new book title");
              id = res.body._id;
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title"); // string exata
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isArray(res.body[0].comments);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "title");
            assert.property(res.body[0], "commentcount");
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/fakeid")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists"); // string exata
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/" + id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "new book title");
            assert.isArray(res.body.comments);
            assert.equal(res.body.commentcount, 0);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({ comment: "new comment" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "new book title");
              assert.isArray(res.body.comments);
              assert.equal(res.body.comments[0], "new comment");
              assert.equal(res.body.commentcount, 1);
              done();
            });
        });

        test("Test POST /api/books/[id] with no comment given", function (done) {
          chai
            .request(server)
            .post("/api/books/" + id)
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment"); // string exata
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object with id", function () {
      test("Test DELETE /api/books/[id]", function (done) {
        chai
          .request(server)
          .delete("/api/books/" + id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful"); // string exata
            done();
          });
      });

      test("Test DELETE /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/fakeid")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists"); // string exata
            done();
          });
      });
    });

    suite("DELETE /api/books => delete all books", function () {
      test("Test DELETE /api/books", function (done) {
        chai
          .request(server)
          .delete("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "complete delete successful"); // string exata
            done();
          });
      });
    });
  });
});
