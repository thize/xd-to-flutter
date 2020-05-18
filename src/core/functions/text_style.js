const { widgetPrefix, exportTo, copyToClipboard } = require("./util/util");
const assets = require("assets");
const { formatDart } = require("./util/format_dart");
const { dartColor } = require("../widgets/util/util");
const { exportFiles } = require("./util/project_folder");
const { changeOutputUiText } = require("../../ui/components/output_ui");

function exporTextStylesFromAssetsPanel() {
    const assetsTextStyles = assets.characterStyles.get();
    let resStyles = '';
    assetsTextStyles.forEach((assetsTextStyle, index) => {
        const name = assetsTextStyle.name != null ? assetsTextStyle.name : `textStyle${index + 1}`;
        const generatedTextStyle = _generateTextStyle(assetsTextStyle.style);
        const generatedStaticTextStyle = `static TextStyle get ${name} => const ${generatedTextStyle};`
        resStyles += generatedStaticTextStyle;
    });
    if (resStyles == '') {
        changeOutputUiText('Without Text Styles in Assets Panel', 'red');
    } else {
        const prefix = widgetPrefix();
        const appTextStylesClass = formatDart(`class ${prefix}AppTextStyles {${resStyles}}`);
        const exportToValue = exportTo();
        if (exportToValue == 'clipboard') {
            copyToClipboard(appTextStylesClass);
            changeOutputUiText('class AppTextStyles copied to clipboard');
        } else {
            changeOutputUiText('Exporting app_text_styles.dart');
            exportFiles(['app_text_styles.dart'], [appTextStylesClass]);
        }
    }
}

module.exports = {
    exporTextStylesFromAssetsPanel: exporTextStylesFromAssetsPanel,
};

function _generateTextStyle(textStyle) {
    return `TextStyle(
        color: ${dartColor(textStyle.fill)},
        fontSize: ${textStyle.fontSize},
        ${_fontWeight(textStyle)}
        fontFamily: '${textStyle.fontFamily}',
        ${_decoration(textStyle)}
      )`;
}

function _fontWeight(style) {
    let fontWeight = style.fontStyle.toLowerCase().replace("-", "");
    if (fontWeight == "thin") {
        fontWeight = "100";
    } else if (fontWeight == "extraligth") {
        fontWeight = "200";
    } else if (fontWeight == "light") {
        fontWeight = "300";
    } else if (fontWeight == "medium") {
        fontWeight = "500";
    } else if (fontWeight == "semibold") {
        fontWeight = "600";
    } else if (fontWeight == "bold") {
        fontWeight = "700";
        return 'fontWeight: FontWeight.bold,';
    } else if (fontWeight == "extrabold") {
        fontWeight = "800";
    } else if (fontWeight == "black") {
        fontWeight = "900";
    } else {
        fontWeight = "400";
        return "";
    }
    return `fontWeight: FontWeight.w${fontWeight},`;
}

function _decoration(style) {
    let content;
    if (style.strikethrough && style.underline) {
        content = `TextDecoration.combine(
        [TextDecoration.lineThrough, TextDecoration.underline])`;
    } else if (style.strikethrough) {
        content = "TextDecoration.lineThrough";
    } else if (style.underline) {
        content = "TextDecoration.underline";
    }
    if (content != undefined) {
        return `decoration: ${content},`;
    }
    return "";
}