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

function copyToClipboard(value) {
    clipboard.copyText(value);
}

module.exports = {
    widgetPrefix: widgetPrefix,
    exportTo: exportTo,
    copyToClipboard: copyToClipboard,
};
