const { buttonUi } = require("./util");

function exportButtonsUi() {
    const title = '<h1>Export: </h1>';
    const artboards = buildRadio('artboards', 'Artboards', true);
    const colors = buildRadio('colors', 'Colors');
    const components = buildRadio('components', 'Components');
    const fontStyles = buildRadio('fontStyles', 'FontStyles');
    const switchs = artboards + components + '<br>' + colors + fontStyles;
    const buttons = switchs +
        exportAllButton() + exportSingleColorButton();
    return title + buttons;
}

module.exports = {
    exportButtonsUi: exportButtonsUi,
};

function exportSingleColorButton() {
    return buttonUi('singleColorButton', 'Selected Item Color', false);
}

function exportAllButton() {
    return buttonUi('exportAllButton', 'Export All', true);
}

function buildRadio(id, text, checked) {
    return `<label><input type="radio" id="exportAllRadio" name="exportAllRadio" value="${text}" ${checked ? 'checked' : ''}> ${text}</label>`;
}