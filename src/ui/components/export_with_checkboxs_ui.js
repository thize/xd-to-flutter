const { rowUi } = require("./util");

function exportWithCheckBoxsUi() {
    const title = '<h1>Export with</h1>';
    const checkboxs =
        googleFontsUi() +
        prototypeInteractionsUi() +
        simpleCodeUi() + styledWidgetUi();
    return title + checkboxs;
}

module.exports = {
    exportWithCheckBoxsUi: exportWithCheckBoxsUi,
};



function googleFontsUi() {
    return rowUi(`<input type="checkbox" id="googleFonts" name="googleFonts" checked>Google Fonts`);
}

function prototypeInteractionsUi() {
    return rowUi(`<input type="checkbox" id="prototypeInteractions" name="prototypeInteractions" checked>Prototype Interactions`);
}

function simpleCodeUi() {
    return rowUi(`<input type="checkbox" id="simpleCode" name="simpleCode" >SimpleCode`);
}

function styledWidgetUi() {
    return rowUi(`<input type="checkbox" id="stlyedWidget" name="stlyedWidget" disabled="disabled" >Styled Widget (Not yet)`);
}
