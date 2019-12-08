const { xd_to_array } = require("./xd_to_json/xd_to_array");
const { xd_to_json } = require("./xd_to_json/xd_to_json");
const { showMessageWithColor, isNotEmptySelectionItens } = require("../util");
const { json_to_flutter } = require("./json_to_flutter/json_to_flutter");

async function export_widget(selection, simpleCode, division) {
    if (isNotEmptySelectionItens(selection)) {
        let array = await xd_to_array(selection.itemsIncludingLocked);
        let json = xd_to_json(array, selection);
        let code = await json_to_flutter(json, simpleCode, division);
        return code;
    } else {
        showMessageWithColor("Select something", "grey");
    }
}

module.exports = { export_widget };