const { doubleWithTag } = require("./double_with_tag");

function width(node) {
    let width = node.width;
    width = width != null ? width : node.localBounds.width;
    return doubleWithTag('width', width);
}

function height(node) {
    let height = node.height;
    height = height != null ? height : node.localBounds.height;
    return doubleWithTag('height', height);
}

module.exports = {
    height: height,
    width: width,
};