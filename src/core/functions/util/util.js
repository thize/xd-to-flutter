const clipboard = require("clipboard");

function widgetPrefix() {
    const element = document.getElementById('widgetsPrexix');
    const prefix = element.value;
    if (!prefix) return '';
    return prefix;
}

function exportTo() {
    let exportToRadio = document.querySelector('input[name="exportTo"]:checked');
    const value = exportToRadio.value;
    return value;
}

function exportType() {
    let exportToRadio = document.querySelector('input[name="exportType"]:checked');
    const value = exportToRadio.value;
    return value;
}

function withInkWell() {
    let withInkWell = document.querySelector('input[name="prototypeInteractions"]');
    const value = withInkWell.checked;
    return value;
}

function withGoogleFonts() {
    let withGoogleFonts = document.querySelector('input[name="googleFonts"]');
    const value = withGoogleFonts.checked;
    return value;
}

function copyToClipboard(value) {
    clipboard.copyText(value);
}

module.exports = {
    widgetPrefix: widgetPrefix,
    exportTo: exportTo,
    exportType: exportType,
    withInkWell: withInkWell,
    withGoogleFonts: withGoogleFonts,
    copyToClipboard: copyToClipboard,
};
