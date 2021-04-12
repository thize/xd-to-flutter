const { rowUi } = require("./util");

function exportWithCheckBoxsUi() {
    const title = '<h1>Export with</h1>';
    const checkboxs =
        prototypeInteractionsUi();
    return title + checkboxs;
}

module.exports = {
    exportWithCheckBoxsUi: exportWithCheckBoxsUi,
};

function prototypeInteractionsUi() {
    return rowUi(`<input type="checkbox" id="prototypeInteractions" name="prototypeInteractions" checked>Prototype Interactions`);
}
