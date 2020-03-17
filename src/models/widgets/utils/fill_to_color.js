const { fixDouble } = require("./fix_double");
const { materialColors } = require("./material_colors");

function fillToColor(fill) {
    const hex = fill.toHex(true).replace("#", "").toUpperCase();
    const color = `${colorToMaterialColor(`Color(0xFF${hex})`)}${withOpacity(fill)}`;
    return color;
}

module.exports = {
    fillToColor: fillToColor,
};

function withOpacity(fill) {
    const opacity = fixDouble(fill.a / 255);
    if (opacity != 1) {
        return `.withOpacity(${opacity})`;
    }
    return ``;
}


function colorToMaterialColor(color) {
    if (materialColors[color] != null) {
        return materialColors[color];
    } else {
        return `const ${color}`;
    }
}