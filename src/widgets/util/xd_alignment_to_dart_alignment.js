
function xdAlignmentToDartAlignment(x, y) {
    const { fix } = require('../../util');
    /// 0 to 1, have to be -1 to 1
    const dx = fix(fixAlignment(x));
    const dy = fix(fixAlignment(y));
    const align = `Alignment(${dx},${dy})`;
    const dif = Math.abs(dx - dy);
    if (dif < 0.02) return 'Alignment.center';
    return nameAlignment[align] ? nameAlignment[align] : align;
}

const nameAlignment = {
    'Alignment(-1.0,-1.0)': 'Alignment.topLeft',
    'Alignment(1.0,-1.0)': 'Alignment.topRight',
    'Alignment(0.0,-1.0)': 'Alignment.topCenter',
    'Alignment(1.0,0.0)': 'Alignment.centerRight',
    'Alignment(-1.0,0.0)': 'Alignment.centerLeft',
    'Alignment(0.0,0.0)': 'Alignment.center',
    'Alignment(1.0,1.0)': 'Alignment.bottomRight',
    'Alignment(-1.0,1.0)': 'Alignment.bottomLeft',
    'Alignment(0.0,1.0)': 'Alignment.bottomCenter',
}

function xdAlignmentToStyledDartAlignment(x, y) {
    const { fix } = require('../../util');
    /// 0 to 1, have to be -1 to 1
    const dx = fix(fixAlignment(x));
    const dy = fix(fixAlignment(y));
    const align = `Alignment(${dx},${dy})`;
    const dif = Math.abs(dx - dy);
    if (dif < 0.02) return ['.center()'];
    return nameStyleAlignment[align] ? [nameStyleAlignment[align]] : [dx, dy];
}

const nameStyleAlignment = {
    'Alignment(-1.0,-1.0)': '.topLeft',
    'Alignment(1.0,-1.0)': '.topRight',
    'Alignment(0.0,-1.0)': '.topCenter',
    'Alignment(1.0,0.0)': '.centerRight',
    'Alignment(-1.0,0.0)': '.centerLeft',
    'Alignment(0.0,0.0)': '.center()',
    'Alignment(1.0,1.0)': '.bottomRight',
    'Alignment(-1.0,1.0)': '.bottomLeft',
    'Alignment(0.0,1.0)': '.bottomCenter',
}

exports.xdAlignmentToDartAlignment = xdAlignmentToDartAlignment;
exports.xdAlignmentToStyledDartAlignment = xdAlignmentToStyledDartAlignment;

/// 0 => -1
/// 0.5 => 0
/// 1 => 1
/// Function = 2x - 1

function fixAlignment(value) {
    return (2 * value) - 1;
}