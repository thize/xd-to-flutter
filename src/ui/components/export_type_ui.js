const { rowUi } = require("./util");

function exportTypeUi() {
    const title = '<h2>Export Selection Type</h2>';
    const normalType = rowUi(`<input type="radio" id="exportType" name="exportType" value="normal" checked>Normal`);
    const classType = rowUi(`<input type="radio" id="exportType" name="exportType" value="stateless">Stateless Widget`);
    return title + normalType + classType;
}

module.exports = {
    exportTypeUi: exportTypeUi,
};
