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



// function googleFontsUi() {
//     return rowUi(`<input type="checkbox" id="googleFonts" name="googleFonts">Google Fonts`);
// }

// function simpleCodeUi() {
//     return rowUi(`<input type="checkbox" id="simpleCode" name="simpleCode" >SimpleCode`);
// }

function prototypeInteractionsUi() {
    return rowUi(`<input type="checkbox" id="prototypeInteractions" name="prototypeInteractions" checked>Prototype Interactions`);
}


function simpleTypeUi() {
    return rowUi(`<input type="checkbox" id="simpleType" name="simpleType">Simple Type (Alpha)`);
    // return rowUi(`<input type="checkbox" id="simpleType" name="simpleType" >Simple Type (Beta)`);
}
