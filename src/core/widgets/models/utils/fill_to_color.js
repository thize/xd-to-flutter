const { colorToMaterialColor } = require("./material_colors");
const { getOpacity } = require("../../util/util");

function fillToColor(fill, node) {
    const opacity = node ? getOpacity(node) : 1;
    const hex = fill.toHex(true).replace("#", "").toUpperCase();
    const fillOpacity = fill.a / 255;
    const color = `${colorToMaterialColor(`Color(0xFF${hex})`)}${withOpacity(opacity * fillOpacity)}`;
    return color;
}

module.exports = {
    fillToColor: fillToColor,
};

function withOpacity(opacity) {
    if (opacity != 1) {
        return `.withOpacity(${opacity})`;
    }
    return ``;
}