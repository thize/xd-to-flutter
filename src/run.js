let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
const { Container } = require("./widget/container");

function run() {
    const node = scenegraph.selection.items[0];
    const widgtets = [
        generateWidgetByType(node),
    ];
    clipboard.copyText(widgtets[0].toDart());
}

module.exports = {
    run: run,
};

function generateWidgetByType(node) {
    return new Container(node);
}