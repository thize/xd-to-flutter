const { buttonUi } = require("./util");

function exportButtonsUi() {
    const titleAll = '<h1>Export All: </h1>';
    const title = '<h1>Copy: </h1>';
    const artboards = buildRadio('Artboards', true);
    const colors = buildRadio('Colors');
    const components = buildRadio('Components');
    const fontStyles = buildRadio('FontStyles');
    const switchs = artboards + components + '<br>' + colors + fontStyles;

    const exportContent = title + exportSelectionButton() + exportSingleColorButton();
    const exportAllContent = titleAll + switchs + exportAllButton();
    return exportContent + '<hr>' + exportAllContent;
}

function exportIconButtons() {
    const titleIcons = '<h1>Export Icon: </h1>';
    const exportIcon = titleIcons + exportIosIconButton() + exportAndroidIconButton();
    return exportIcon;
}

module.exports = {
    exportButtonsUi: exportButtonsUi,
    exportIconButtons: exportIconButtons,
};

function exportSelectionButton() {
    return buttonUi('selectionButton', 'Selected Item', false);
}

function exportSingleColorButton() {
    return buttonUi('singleColorButton', 'Selected Item Color', false);
}

function exportIosIconButton() {
    return buttonUi('iosIconButton', 'iOS Icon', false);
}

function exportAndroidIconButton() {
    return buttonUi('androidIconButton', 'Android Icon', false);
}

function exportAllButton() {
    return buttonUi('exportAllButton', 'Export All', true);
}

function buildRadio(text, checked) {
    return `<label><input type="radio" id="exportAllRadio" name="exportAllRadio" value="${text}" ${checked ? 'checked' : ''}> ${text}</label>`;
}