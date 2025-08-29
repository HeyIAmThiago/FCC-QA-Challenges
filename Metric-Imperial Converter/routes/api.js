"use strict";

const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.get("/api/convert", (req, res) => {
    const input = req.query.input;

    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);

    const numInvalid = initNum === "invalid number";
    const unitInvalid = initUnit === "invalid unit";

    if (numInvalid && unitInvalid) {
      return res.send("invalid number and unit");
    }
    if (numInvalid) {
      return res.send("invalid number");
    }
    if (unitInvalid) {
      return res.send("invalid unit");
    }

    const returnNum = convertHandler.convert(initNum, initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const string = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );

    res.json({
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string,
    });
  });
};
