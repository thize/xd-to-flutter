const { rowUi } = require("./util");

function exportToUi() {
    const title = '<h2>Export to:</h2>';
    const normalType = rowUi(`<input type="radio" id="clipboard" name="exportTo" checked>Clipboard`);
    const classType = rowUi(`<input type="radio" id="dartFile" name="exportTo" >Dart File`);
    return title + normalType + classType;
}

module.exports = {
    exportToUi: exportToUi,
};
