const { image } = require("./json/image");
const { line } = require("./json/line");
const { polygon } = require("./json/polygon");
const { rectangle } = require("./json/rectangle");
const { svg } = require("./json/svg");
const { text } = require("./json/text");
const { sizedBox } = require("./json/sizedBox");

function xdToJson(list, selection) {
    const isArtboard = selection.constructor.name == "Artboard";
    let all = isArtboard ? null : `"${0}": ${sizedBox(selection)}`;
    list.forEach((a, i) => {
        let index = isArtboard ? i : i + 1;
        if (all == null) {
            all = `"${index}": ${_itemJson(a)}`;
        } else {
            all += `,"${index}": ${_itemJson(a)}`;
        }
    });
    var json = JSON.parse(JSON.stringify(`{${all}}`));
    return json;
}

function _itemJson(node) {
    var name = node.constructor.name;
    if (name == "BooleanGroup" || name == "Path" || (name == "Group" && (node.name.includes("svg_") || node.mask))) {
        return svg(node);
    } else if (name == "Polygon") {
        return polygon(node);
    } else if (_isImage(name, node)) {
        return image(node);
    } else if (name == "Line") {
        return line(node);
    } else if (name == "Text") {
        return text(node);
    } else if (name == "Artboard" || name == "Ellipse" || name == "Rectangle") {
        return rectangle(node);
    }
}

function _isImage(name, node) {
    return name == "Rectangle" && node.fill.mimeType != null && node.fill.mimeType.includes("image");
}

module.exports = { xdToJson };