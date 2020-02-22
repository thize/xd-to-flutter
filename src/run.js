let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
const { Container } = require("./widget/container");
const { Text } = require("./widget/text");

function run() {
    const node = scenegraph.selection.items[0];
    const widget = generateWidgetByType(node);
    clipboard.copyText(widget.toDart());
}

module.exports = {
    run: run,
};

function generateWidgetByType(node) {
    const name = node.constructor.name;
    if (name == 'Rectangle' || name == 'Line' || name == 'Ellipse') {
        return new Container(node);
    } else if (name == 'Text') {
        return new Text(node);
    }
    return new Container(node);
}