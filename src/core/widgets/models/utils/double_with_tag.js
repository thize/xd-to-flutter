const { fixDouble } = require("./fix_double");
const { simpleCode } = require("../../util/util");

function doubleWithTag(tag, value) {
    const double = fixDouble(value);
    const prefix = (tag == 'width' || tag == 'left' || tag == 'right') ? 'w' : (tag == 'height' || tag == 'bottom' || tag == 'top') ? 'h' : null;
    return `${tag}: ${simpleCode(double, prefix)},`;
}

module.exports = {
    doubleWithTag: doubleWithTag,
};

