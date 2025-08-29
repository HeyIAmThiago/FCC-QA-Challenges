const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");
const locales = ["american-to-british", "british-to-american"];

suite("Functional Tests", () => {
  test("POST with text and locale fields", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .type("form")
      .send({ text: "Mangoes are my favorite fruit", locale: locales[0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.property(res.body, "text");
        assert.property(res.body, "translation");
        done();
      });
  });

  test("POST with text and invalid locale field", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .type("form")
      .send({
        text: "Mangoes are my favorite fruit",
        locale: "canadian-to-japanese",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid value for locale field");
        done();
      });
  });

  test("POST with missing text field", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .type("form")
      .send({ locale: locales[0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("POST with missing locale field", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .type("form")
      .send({ text: "Mangoes are my favorite fruit" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("POST with empty text", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .type("form")
      .send({ text: "", locale: locales[0] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.property(res.body, "error");
        assert.equal(res.body.error, "No text to translate");
        done();
      });
  });

  test("POST with text that needs no translation", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .type("form")
      .send({ text: "Mangoes are the best fruit", locale: locales[1] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body, "response should be an object");
        assert.property(res.body, "text");
        assert.property(res.body, "translation");
        assert.equal(res.body.translation, "Everything looks good to me!");
        done();
      });
  });
});
