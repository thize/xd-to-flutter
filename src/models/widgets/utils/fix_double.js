function fixDouble(double) {
    return double;//.toFixed(2).replace('.00', '.0');
}

module.exports = {
    fixDouble: fixDouble,
};

