

function getColor(color, opacity = 1.0) {
    const hexColor = color.toHex(true).replace("#", "").toUpperCase();
    return "const Color(0xFF" + hexColor + ")" + _withOpacity((color.a / 255) * opacity);
}

exports.getColor = getColor;

function _withOpacity(opacity) {
    const { fix } = require("../../util");
    opacity = fix(opacity);
    if (opacity != 1) {
        return `.withOpacity(${opacity})`;
    }
    return ``;
}