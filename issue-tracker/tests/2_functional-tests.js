const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let testId; // will store a real issue ID
  let testId2; // for multiple filter test

  // POST tests
  test("Create an issue with every field: POST", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "Full fields",
        issue_text: "Testing all fields",
        created_by: "Tester",
        assigned_to: "Chai",
        status_text: "In QA",
      })
      .end(function (err, res) {
        assert.equal(res.status, 201);
        assert.property(res.body, "_id");
        assert.equal(res.body.issue_title, "Full fields");
        assert.equal(res.body.issue_text, "Testing all fields");
        assert.equal(res.body.created_by, "Tester");
        assert.equal(res.body.assigned_to, "Chai");
        assert.equal(res.body.status_text, "In QA");
        assert.equal(res.body.created_on, res.body.updated_on);
        testId = res.body._id;
        done();
      });
  });

  test("Create an issue with only required fields: POST", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "Required only",
        issue_text: "Testing required fields",
        created_by: "Tester",
      })
      .end(function (err, res) {
        assert.equal(res.status, 201);
        assert.property(res.body, "_id");
        assert.equal(res.body.issue_title, "Required only");
        assert.equal(res.body.issue_text, "Testing required fields");
        assert.equal(res.body.created_by, "Tester");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        testId2 = res.body._id;
        done();
      });
  });

  test("Create an issue with missing required fields: POST", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  // GET tests
  test("View issues on a project: GET", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test("View issues on a project with one filter: GET", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_title=Full fields")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body[0].issue_title, "Full fields");
        done();
      });
  });

  test("View issues on a project with multiple filters: GET", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?issue_title=Required only&open=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.equal(res.body[0].issue_title, "Required only");
        assert.equal(res.body[0].open, true);
        done();
      });
  });

  // PUT tests
  test("Update one field on an issue: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: testId,
        issue_title: "Updated title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, testId);
        done();
      });
  });

  test("Update multiple fields on an issue: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: testId,
        issue_text: "Updated text",
        assigned_to: "Updated Assignee",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, testId);
        done();
      });
  });

  test("Update an issue with missing _id: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  test("Update an issue with no fields to update: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: testId })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, testId);
        done();
      });
  });

  test("Update an issue with an invalid _id: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: "invalidid123", issue_text: "won't work" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "invalidid123");
        done();
      });
  });

  // DELETE tests
  test("Delete an issue: DELETE", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: testId })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, testId);
        done();
      });
  });

  test("Delete an issue with an invalid _id: DELETE", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: "badid123" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "badid123");
        done();
      });
  });

  test("Delete an issue with missing _id: DELETE", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
