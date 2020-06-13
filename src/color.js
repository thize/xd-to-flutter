const { getColor } = require("./widgets/util/color");
const { exportDialog } = require("./ui/dialogs/dialogs");

let clipboard = require("clipboard");
let scenegraph = require("scenegraph")

let withErro;
let color;

const keydownFunc = function (event) {
    try {
        const key = event.key;
        if (key == 1) {
            color = exportFill();
        } else if (key == 2) {
            color = exportStroke();
        } else if (key == 3) {
            color = exportShadow();
        } else if (key == 'Escape') {
        } else {
            withErro = 'invalidKey';
        }
    } catch (error) {
        withErro = true;
    }
    if (color) clipboard.copyText(color);
    return false;
};

async function exportColor() {
    withErro = null;
    color = null;
    const node = scenegraph.selection.items[0];
    if (node.children.length > 1 || scenegraph.selection.items.length > 1) {
        await exportDialog("Select only one item", 'Ok', 'Tap any key to close');
    } else {
        document.addEventListener('keydown', keydownFunc);
        await exportDialog("Copy Item Color, Tap:", 'Cancelar', "1 to Fill<br>2 to Stroke<br>3 to Shadow");
        document.removeEventListener('keydown', keydownFunc);
        if (withErro != null) {
            if (withErro == 'invalidKey') {
                await exportColor();
            } else {
                await exportDialog("Error", 'Ok', 'Tap any key to close');
            }
        } else {
            if (color != null) {
                await exportDialog("Success", 'Ok', 'Tap any key to close');
            }
        }
    }
}

function exportFill() {
    const node = scenegraph.selection.items[0];
    return getColor(node.fill);
}

function exportStroke() {
    const node = scenegraph.selection.items[0];
    return getColor(node.stroke);
}

function exportShadow() {
    const node = scenegraph.selection.items[0];
    return getColor(node.shadow.color);
}

module.exports = {
    exportColor: exportColor,
};