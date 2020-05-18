const { exportSelectionColor, exporColorsFromAssetsPanel } = require('./color');
const { exporTextStylesFromAssetsPanel } = require('./text_style');

function onTapExport(type) {
    switch (type) {
        case 'Selection':
            exportSelection();
            break;
        case 'Artboards':
            exportArtboards();
            break;
        case 'Components':
            exportComponents();
            break;
        case 'Colors':
            exporColorsFromAssetsPanel();
            break;
        case 'FontStyles':
            exporTextStylesFromAssetsPanel();
            break;
        case 'SingleColor':
            exportSelectionColor();
            break;
        default:
            console.log('Type not mapped');
            break;
    }
}

module.exports = {
    onTapExport: onTapExport,
};

function exportSelection() {
    console.log('exportSelection');
}

function exportArtboards() {
    console.log('exportArtboards');
}

function exportComponents() {
    console.log('exportComponents');
}