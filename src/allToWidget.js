const { generateJson } = require("./functions/json/generateJson");
const { generateList } = require("./functions/generateList");
const { generateWidgetFromJson } = require("./functions/widget/main");
const { showMessageWithColor } = require("./showMessage");

async function allToWidget(selection, simpleCode, division) {
    if (selection.items.length != 0) {
        var list = [];
        generateList(list, selection.items);
        var json = generateJson(list);
        var code = await generateWidgetFromJson(json, simpleCode, division);
        return code;
    } else {
        showMessageWithColor("Select something", "grey");
    }
}

module.exports = { allToWidget };
