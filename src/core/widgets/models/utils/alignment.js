const { fixDouble } = require("./fix_double");

function alignment(x, y, factor = 100) {
    /// 0 to 1, have to be -1 to 1
    const dx = applyFunction(x);
    const dy = applyFunction(y);
    const align = `Alignment(${fixDouble(dx, factor)},${fixDouble(dy, factor)})`;
    return alignmentFix[align] ? alignmentFix[align] : align;
}

const alignmentFix = {
    'Alignment(-1,-1)': 'Alignment.topLeft',
    'Alignment(1,-1)': 'Alignment.topRight',
    'Alignment(0,-1)': 'Alignment.topCenter',
    'Alignment(1,0)': 'Alignment.centerRight',
    'Alignment(-1,0)': 'Alignment.centerLeft',
    'Alignment(0,0)': 'Alignment.center',
    'Alignment(1,1)': 'Alignment.bottomRight',
    'Alignment(-1,1)': 'Alignment.bottomLeft',
    'Alignment(0,1)': 'Alignment.bottomCenter',
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