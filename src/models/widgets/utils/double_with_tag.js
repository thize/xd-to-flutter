const { fixDouble } = require("./fix_double");

function doubleWithTag(tag, value) {
    const double = fixDouble(value);
    return `${tag}: ${double},`;
}

module.exports = {
    doubleWithTag: doubleWithTag,
};

