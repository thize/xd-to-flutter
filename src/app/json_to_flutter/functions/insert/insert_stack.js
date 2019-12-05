const { insertWidgetAtNoWithType } = require("./insert");
const { Stack } = require("../../models/stack");

function insertStack(father, widget) {
    insertWidgetAtNoWithType(widget, father, Stack);
}

module.exports = { insertStack };