const { fixDouble } = require("./fix_double");

function alignment(x, y) {
    /// 0 to 1, have to be -1 to 1
    const dx = applyFunction(x);
    const dy = applyFunction(y);
    return `Alignment(${fixDouble(dx)}, ${fixDouble(dy)})`;
}

module.exports = {
    alignment: alignment,
};

/// 0 => -1
/// 0.5 => 0
/// 1 => 1
/// Function = 2x - 1

function applyFunction(value) {
    return (2 * value) - 1;
}