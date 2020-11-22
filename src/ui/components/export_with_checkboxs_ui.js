const { rowUi } = require("./util");

function exportWithCheckBoxsUi() {
    const title = '<h1>Export with</h1>';
    const checkboxs =
        prototypeInteractionsUi() +
        // googleFontsUi() +
        // simpleCodeUi() +
        simpleTypeUi();
    return title + checkboxs;
}

module.exports = {
    exportWithCheckBoxsUi: exportWithCheckBoxsUi,
};



function googleFontsUi() {
    return rowUi(`<input type="checkbox" id="googleFonts" name="googleFonts">Google Fonts`);
}

function prototypeInteractionsUi() {
    return rowUi(`<input type="checkbox" id="prototypeInteractions" name="prototypeInteractions" checked>Prototype Interactions`);
}

function simpleCodeUi() {
    return rowUi(`<input type="checkbox" id="simpleCode" name="simpleCode" >SimpleCode`);
}

function simpleTypeUi() {
    return rowUi(`<input type="checkbox" id="simpleType" name="simpleType" disabled="disabled" >Simple Type (Coming soon)`);
    // return rowUi(`<input type="checkbox" id="simpleType" name="simpleType" >Simple Type (Beta)`);
}
