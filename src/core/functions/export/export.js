const { exportSelectionColor, exporColorsFromAssetsPanel } = require('./color');
const { exporTextStylesFromAssetsPanel } = require('./text_style');
const { exporComponentsFromAssetsPanel } = require('./components');
const { exportAllArtboards } = require('./artboards');
const { exportSelection } = require('./selection');
const { changeOutputUiText } = require('../../../ui/components/output_ui');

function onTapExport(type) {
    try {
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
    } catch (error) {
        let words = error.toString().split(' ').length;
        console.log('teste');
        
        if (words == 1) {
            changeOutputUiText(`${error} is not supported`, 'red');
        } else {
            changeOutputUiText(error, 'red');
        }
    }
}

module.exports = {
    onTapExport: onTapExport,
};
