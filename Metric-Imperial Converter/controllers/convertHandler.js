function ConvertHandler() {
  this.getNum = function (input) {
    if (!input) return 1;

    input = input.trim();
    let firstLetterIndex = input.search(/[a-zA-Z]/);
    if (firstLetterIndex === -1) firstLetterIndex = input.length;

    const numStr = input.slice(0, firstLetterIndex).trim();
    if (numStr === "") return 1; // default to 1 when no numeric part

    const isValidNumberString = (s) => /^(\d+(\.\d+)?|\.\d+)$/.test(s.trim());

    const slashMatches = numStr.match(/\//g);
    if (slashMatches && slashMatches.length > 1) return "invalid number";

    if (numStr.includes("/")) {
      const parts = numStr.split("/");
      if (parts.length !== 2) return "invalid number";
      const aStr = parts[0].trim();
      const bStr = parts[1].trim();
      if (aStr === "" || bStr === "") return "invalid number";
      if (!isValidNumberString(aStr) || !isValidNumberString(bStr))
        return "invalid number";

      const a = parseFloat(aStr);
      const b = parseFloat(bStr);
      if (b === 0) return "invalid number";

      return a / b;
    }

    if (!isValidNumberString(numStr)) return "invalid number";
    return parseFloat(numStr);
  };

  this.getUnit = function (input) {
    if (!input) return "invalid unit";

    let firstLetterIndex = input.search(/[a-zA-Z]/);
    if (firstLetterIndex === -1) return "invalid unit";

    let unit = input.slice(firstLetterIndex).trim().toLowerCase();

    const validUnits = ["gal", "l", "mi", "km", "lbs", "kg"];
    if (!validUnits.includes(unit)) return "invalid unit";

    // liter is represented as uppercase "L"
    if (unit === "l") return "L";
    return unit;
  };

  this.getReturnUnit = function (initUnit) {
    if (!initUnit) return null;
    const map = {
      gal: "L",
      L: "gal",
      mi: "km",
      km: "mi",
      lbs: "kg",
      kg: "lbs",
    };
    return map[initUnit];
  };

  this.spellOutUnit = function (unit) {
    const spellMap = {
      gal: "gallons",
      L: "liters",
      mi: "miles",
      km: "kilometers",
      lbs: "pounds",
      kg: "kilograms",
    };
    return spellMap[unit];
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch (initUnit) {
      case "gal":
        result = initNum * galToL;
        break;
      case "L":
        result = initNum / galToL;
        break;
      case "mi":
        result = initNum * miToKm;
        break;
      case "km":
        result = initNum / miToKm;
        break;
      case "lbs":
        result = initNum * lbsToKg;
        break;
      case "kg":
        result = initNum / lbsToKg;
        break;
      default:
        return null;
    }

    return Number(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(
      initUnit
    )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
