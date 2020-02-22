const { fixDouble } = require("./fix_double");

function fillToColor(fill) {
    const hex = fill.toHex(true).replace("#", "");
    const color = `const Color(0xff${hex})${withOpacity(fill)}`;
    return color;
}

function withOpacity(fill) {
    const opacity = fixDouble(fill.a / 255);
    if (opacity != 1) {
        return `.withOpacity(${opacity})`;
    }
    return ``;
}

module.exports = {
    fillToColor: fillToColor,
};
