const { image } = require("./json/image");
const { line } = require("./json/line");
const { polygon } = require("./json/polygon");
const { rectangle } = require("./json/rectangle");
const { svg } = require("./json/svg");
const { text } = require("./json/text");

function xd_to_json(list) {
    let all;
    list.forEach((a, i) => {
        if (all == null) {
            all = `"${i}": ${_itemJson(a)}`;
        } else {
            all += `,"${i}": ${_itemJson(a)}`;
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

module.exports = { xd_to_json };