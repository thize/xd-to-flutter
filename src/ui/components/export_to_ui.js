const { rowUi } = require("./util");

function exportToUi() {
    const title = '<h2>Export to:</h2>';
    const normalType = rowUi(`<input type="radio" id="exportTo" name="exportTo"  value="clipboard" checked>Clipboard`);
    const classType = rowUi(`<input type="radio" id="exportTo" name="exportTo" value="dartFile" >Dart File`);
    return title + normalType + classType;
}

module.exports = {
    exportToUi: exportToUi,
};
