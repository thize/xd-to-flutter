const { rowUi } = require("./util");

function exportWithCheckBoxsUi() {
    const title = '<h1>Export with</h1>';
    const checkboxs =
        prototypeInteractionsUi() +
        // googleFontsUi() +
        // simpleCodeUi() +
        styledWidgetUi();
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

function styledWidgetUi() {
    return rowUi(`<input type="checkbox" id="stlyedWidget" name="stlyedWidget" disabled="disabled" >Styled Widget (Coming soon)`);
}
