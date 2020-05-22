const scenegraph = require("scenegraph");
const assets = require("assets");
const { exportFiles } = require("../util/project_folder");
const { formatDart } = require("../util/format_dart");
const { widgetPrefix, exportTo, copyToClipboard } = require("../util/util");
const { changeOutputUiText } = require("../../../ui/components/output_ui");
const { dartColor, gradientColorList, isGradient } = require("../../widgets/util/util");

async function exportSelectionColor() {
    document.addEventListener('keydown', keydownFunc);
    changeOutputUiText('Tap:\nF to Fill\nB to Border\nS to Shadow', 'DodgerBlue');
}

function exporColorsFromAssetsPanel() {
    const assetsColors = assets.colors.get();
    let resColors = '';
    assetsColors.forEach((assetsColor, index) => {
        const name = assetsColor.name != null ? assetsColor.name : `color${index + 1}`;
        const generatedColor = isGradient(assetsColor) ? gradientColorList(assetsColor) : dartColor(assetsColor.color);
        const staticType = isGradient(assetsColor) ? 'List<Color>' : 'Color';
        const generatedStaticColor = `static ${staticType} get ${name} => ${generatedColor};`
        resColors += generatedStaticColor;
    });
    if (resColors == '') {
        changeOutputUiText('Without Colors in Assets Panel', 'red');
    } else {
        const prefix = widgetPrefix();
        const appColorsClass = formatDart(`class ${prefix}AppColors {${resColors}}`);
        const exportToValue = exportTo();
        if (exportToValue == 'clipboard') {
            copyToClipboard(appColorsClass);
            changeOutputUiText('class AppColors copied to clipboard');
        } else {
            changeOutputUiText('Exporting app_colors.dart');
            exportFiles(['app_colors.dart'], [appColorsClass]);
        }
    }
}

module.exports = {
    exportSelectionColor: exportSelectionColor,
    exporColorsFromAssetsPanel: exporColorsFromAssetsPanel,
};

const keydownFunc = function (event) {
    const item = scenegraph.selection.items[0];
    const key = event.key;
    let color;
    if (key == 'F') {
        const fill = item.fill;
        if (isGradient(fill)) {
            color = gradientColorList(fill);
        } else {
            color = dartColor(fill);
        }
    } else if (key == 'B') {
        color = dartColor(item.stroke);
    } else if (key == 'S') {
        color = dartColor(item.shadow.color);
    }
    document.removeEventListener('keydown', keydownFunc);
    if (key == 'F' || key == 'B' || key == 'S') {
        copyToClipboard(color);
        changeOutputUiText(`Color copied to clipboard`);
    } else {
        changeOutputUiText('Tapped not mapped', 'red');
    }
};
