const { fillToColor } = require("./models/widgets/utils/fill_to_color");
const { exportDialog } = require("./dialogs/dialogs");

let clipboard = require("clipboard");
let scenegraph = require("scenegraph")

const keydownFunc = function (event) {
    const key = event.key;
    if (key == 1) {
        exportFill();
    } else if (key == 2) {
        exportStroke();
    } else if (key == 3) {
        exportShadow();
    }
};

async function exportColor() {
    document.addEventListener('keydown', keydownFunc);
    await exportDialog("Export Color, Tap:", "1 to Fill<br>2 to Stroke<br>3 to Shadow");
    document.removeEventListener('keydown', keydownFunc);
}

function exportFill() {
    const node = scenegraph.selection.items[0];
    if (node.fill != null) {
        clipboard.copyText(fillToColor(node.fill));
    }
}

function exportStroke() {
    const node = scenegraph.selection.items[0];
    if (node.stroke != null) {
        clipboard.copyText(fillToColor(node.stroke));
    }
}

function exportShadow() {
    const node = scenegraph.selection.items[0];
    if (node.shadow.color != null) {
        clipboard.copyText(fillToColor(node.shadow.color));
    }
}

module.exports = {
    exportColor: exportColor,
};