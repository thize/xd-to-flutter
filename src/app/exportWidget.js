const { xdToArray } = require("./xdToJson/xdToArray");
const { xdToJson } = require("./xdToJson/xdToJson");
const { showMessageWithColor, isNotEmptySelectionItens } = require("../util");
const { jsonToFlutter } = require("./jsonToFlutter/jsonToFlutter");

async function exportWidget(selection, simpleCode, division) {
    if (isNotEmptySelectionItens(selection)) {
        let array = await xdToArray(selection.itemsIncludingLocked);
        let json = xdToJson(array, selection);
        let code = await jsonToFlutter(json, simpleCode, division);
        return code;
    } else {
        showMessageWithColor("Select something", "grey");
    }
}

module.exports = { exportWidget };