const { rowUi } = require("./util");

function exportTypeUi() {
    const title = '<h2>Export Selection Type</h2>';
    const normalType = rowUi(`<input type="radio" id="normal" name="exportType" checked>Normal`);
    const classType = rowUi(`<input type="radio" id="class" name="exportType" >Stateless Widget`);
    return title + normalType + classType;
}

module.exports = {
    exportTypeUi: exportTypeUi,
};
