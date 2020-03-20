function fixDouble(double) {
    return Math.round(double * 100) / 100;
}

module.exports = {
    fixDouble: fixDouble,
};