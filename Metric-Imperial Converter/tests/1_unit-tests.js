const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  test("convertHandler should correctly read a whole number input", function () {
    assert.strictEqual(convertHandler.getNum("32L"), 32);
  });

  test("convertHandler should correctly read a decimal number input", function () {
    assert.strictEqual(convertHandler.getNum("3.5kg"), 3.5);
  });

  test("convertHandler should correctly read a fractional input", function () {
    assert.strictEqual(convertHandler.getNum("3/2km"), 1.5);
  });

  test("convertHandler should correctly read a fractional input with a decimal", function () {
    assert.strictEqual(convertHandler.getNum("4.5/3lbs"), 1.5);
  });

  test("convertHandler should correctly return an error on a double-fraction", function () {
    assert.strictEqual(convertHandler.getNum("3/2/3kg"), "invalid number");
  });

  test("convertHandler should correctly default to a numerical input of 1 when no numerical input is provided", function () {
    assert.strictEqual(convertHandler.getNum("kg"), 1);
  });

  test("convertHandler should correctly read each valid input unit", function () {
    const units = ["gal", "L", "mi", "km", "lbs", "kg"];
    units.forEach((unit) => {
      assert.strictEqual(convertHandler.getUnit("3" + unit), unit);
    });
  });

  test("convertHandler should correctly return an error for an invalid input unit", function () {
    assert.strictEqual(convertHandler.getUnit("32g"), "invalid unit");
  });

  test("convertHandler should return the correct return unit for each valid input unit", function () {
    const pairs = {
      gal: "L",
      L: "gal",
      mi: "km",
      km: "mi",
      lbs: "kg",
      kg: "lbs",
    };
    Object.keys(pairs).forEach((unit) => {
      assert.strictEqual(convertHandler.getReturnUnit(unit), pairs[unit]);
    });
  });

  test("convertHandler should correctly return the spelled-out string unit for each valid input unit", function () {
    const spell = {
      gal: "gallons",
      L: "liters",
      mi: "miles",
      km: "kilometers",
      lbs: "pounds",
      kg: "kilograms",
    };
    Object.keys(spell).forEach((unit) => {
      assert.strictEqual(convertHandler.spellOutUnit(unit), spell[unit]);
    });
  });

  test("convertHandler should correctly convert gal to L", function () {
    assert.approximately(convertHandler.convert(1, "gal"), 3.78541, 0.1);
  });

  test("convertHandler should correctly convert L to gal", function () {
    assert.approximately(convertHandler.convert(1, "L"), 0.26417, 0.1);
  });

  test("convertHandler should correctly convert mi to km", function () {
    assert.approximately(convertHandler.convert(1, "mi"), 1.60934, 0.1);
  });

  test("convertHandler should correctly convert km to mi", function () {
    assert.approximately(convertHandler.convert(1, "km"), 0.62137, 0.1);
  });

  test("convertHandler should correctly convert lbs to kg", function () {
    assert.approximately(convertHandler.convert(1, "lbs"), 0.453592, 0.1);
  });

  test("convertHandler should correctly convert kg to lbs", function () {
    assert.approximately(convertHandler.convert(1, "kg"), 2.20462, 0.1);
  });
});
