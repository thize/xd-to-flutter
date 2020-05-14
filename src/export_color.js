const { fillToColor } = require("./models/widgets/utils/fill_to_color");
const { exportDialog } = require("./dialogs/dialogs");
let clipboard = require("clipboard");
let scenegraph = require("scenegraph")

let withErro;

const keydownFunc = function (event) {
    try {
        withErro = null;
        const key = event.key;
        if (key == 1) {
            exportFill();
        } else if (key == 2) {
            exportStroke();
        } else if (key == 3) {
            exportShadow();
        } else {
            withErro = 'invalidKey';
        }
    } catch (error) {
        withErro = true;
    }
};

async function exportColor() {
    const node = scenegraph.selection.items[0];
    if (node.children.length > 1 || scenegraph.selection.items.length > 1) {
        await exportDialog("Select only one item", 'Ok', 'Tap any key to close');
    } else {
        document.addEventListener('keydown', keydownFunc);
        await exportDialog("Export Color, Tap:", 'Cancelar', "1 to Fill<br>2 to Stroke<br>3 to Shadow");
        document.removeEventListener('keydown', keydownFunc);
        if (withErro != null) {
            if (withErro == 'invalidKey') {
                await exportColor();
            } else {
                await exportDialog("Error", 'Ok', 'Tap any key to close');
            }
        } else {
            await exportDialog("Sucess", 'Ok', 'Tap any key to close');
        }
    }
}

function exportFill() {
    const node = scenegraph.selection.items[0];
    clipboard.copyText(fillToColor(node.fill));
}

function exportStroke() {
    const node = scenegraph.selection.items[0];
    clipboard.copyText(fillToColor(node.stroke));
}

function exportShadow() {
    const node = scenegraph.selection.items[0];
    clipboard.copyText(fillToColor(node.shadow.color));
}

module.exports = {
    exportColor: exportColor,
};