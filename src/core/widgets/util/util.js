const { colorToMaterialColor } = require('../../widgets/util/material_colors');

function dartColor(value) {
    const color = '0xFF' + value.toHex(true).substr(1).toUpperCase();
    return colorToMaterialColor(`Color(${color})`);
}

function gradientColorList(gradient) {
    let colors = [];
    gradient.colorStops.forEach(colorStop => {
        colors.push(dartColor(colorStop.color));
    });
    return `[${colors}]`;
}

function isGradient(fill) {
    return fill.startY != null || (fill.colorStops != null && fill.colorStops.length > 0);
}

module.exports = {
    dartColor: dartColor,
    gradientColorList: gradientColorList,
    isGradient: isGradient,
};