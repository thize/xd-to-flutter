const { generateJson } = require("./functions/json/generateJson");
const { generateList } = require("./functions/generateList");
const { generateWidgetFromJson } = require("./functions/widget/main");
const { showMessageWithColor } = require("./showMessage");
var throwr;
async function allToWidget(selection, simpleCode, division) {
    throwr = undefined;
    exports.throwr = throwr;
    if (selection.items.length != 0) {
        var list = [];
        throwr = await generateList(list, selection.items, division);
        if (throwr != undefined) {
            throw `${throwr} not implemented`;
        }
        var json = generateJson(list);
        var code = await generateWidgetFromJson(json, simpleCode, division);
        return code;
    } else {
        showMessageWithColor("Select something", "grey");
    }
}

module.exports = { allToWidget };
