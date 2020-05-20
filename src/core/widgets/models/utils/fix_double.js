function fixDouble(double, factor = 100) {
    return Math.round(double * factor) / factor;
}

module.exports = {
    fixDouble: fixDouble,
};