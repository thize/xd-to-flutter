const { generateJson } = require("./src/functions/json/generateJson");
const { generateList } = require("./src/functions/generateList");
const { error } = require("./dialog/dialogs");
const { generateWidgetFromJson } = require("./src/functions/widget/main");
let clipboard = require("clipboard");

async function exportJson(selection) {
    if (selection.items.length != 0) {
        var list = [];
        generateList(list, selection.items);
        var json = generateJson(list);
        var code = await generateWidgetFromJson(json);
        clipboard.copyText(code);
    } else {
        error("Error", "Select something");
    }
}

module.exports = {
    commands: {
        createCode: exportJson,
    },
};
