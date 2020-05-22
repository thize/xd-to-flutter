const { getFactor } = require("../../../functions/util/util");

function fixDouble(double, factor) {
    factor = factor ? factor : getFactor();
    const value = parseFloat(double.toFixed(factor));
    return value;
}

module.exports = {
    fixDouble: fixDouble,
};