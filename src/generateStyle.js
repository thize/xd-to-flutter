let assets = require("assets");
const { exportColor } = require("./generateColor");
const { sz, fixName } = require("./util");
var withSimpleCode = require("../main");

function generateStyleClass() {
    const styles = assets.characterStyles.get();
    let resStyles = "";
    styles.forEach((style, index) => {
        let name = fixName(style.name != null ? style.name : `style${index + 1}`);
        name = name[0].toLowerCase() + name.substring(1, name.length);
        const tempStyle = _exportStyle(style.style);
        resStyles += `\n  static TextStyle get ${name} => ${tempStyle};`
    });
    if (resStyles == "") return "";
    return `class AppTextStyles {${resStyles}\n}`;
}

function _exportStyle(style) {
    let withSC = withSimpleCode.withSimpleCode;
    return `${withSC ? '' : 'const '}TextStyle(
        ${exportColor(style.fill, 1, true, false, withSC)}
        fontSize: ${sz(style.fontSize)},
        ${_fontWeight(style)}
        fontFamily: '${style.fontFamily}',
        ${_decoration(style)}
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

module.exports = { generateStyleClass };
