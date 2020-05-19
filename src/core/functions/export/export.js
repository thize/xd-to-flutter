const { exportSelectionColor, exporColorsFromAssetsPanel } = require('./color');
const { exporTextStylesFromAssetsPanel } = require('./text_style');
const { exporComponentsFromAssetsPanel } = require('./components');
const { exportAllArtboards } = require('./artboards');
const { exportSelection } = require('./selection');

function onTapExport(type) {
    switch (type) {
        case 'Selection':
            exportSelection();
            break;
        case 'Artboards':
            exportAllArtboards();
            break;
        case 'Components':
            exporComponentsFromAssetsPanel();
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
