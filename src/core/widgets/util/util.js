const { colorToMaterialColor } = require('../../widgets/models/utils/material_colors');

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

function titleCase(str) {
    str = str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    ).split('\\N').join('\\n');;
    return str.replace(
        /\\n./g,
        function (txt) {
            return txt.substr(0, txt.length - 1) + txt.charAt(txt.length - 1).toUpperCase();
        }
    );
}

module.exports = {
    dartColor: dartColor,
    gradientColorList: gradientColorList,
    isGradient: isGradient,
    titleCase: titleCase,
};