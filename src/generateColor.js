let clipboard = require("clipboard");
const { showMessageWithColor } = require("./showMessageWithColor");
const { fixDouble, fixName } = require("./util");
let assets = require("assets");

function onTapGenerateColor(selection, type) {
    if (selection.focusedArtboard == null && selection.items.length == 0) {
        showMessageWithColor("Select something", "grey", "messageColor");
    } else if (selection.items[0].fill == null) {
        showMessageWithColor("Select only one Widget", "red", "messageColor");
    } else {
        const item = selection.items[0];
        const fill = type == "fill" ? item.fill : type == "border" ? item.stroke : item.shadow.color;
        const color = exportColor(fill, item.opacity);
        clipboard.copyText(color);
        showMessageWithColor("Copied to clipboard", "green", "messageColor");
    }
}

function generateColorClass() {
    const colors = assets.colors.get();
    let resColors = "";
    colors.forEach((color, index) => {
        let name = color.name != null ? color.name : `color${index + 1}`;
        name = fixName(name[0].toLowerCase() + name.substring(1, name.length));
        const isGradient = color.gradientType != null;
        let tempColor;
        tempColor = exportColor(isGradient ? color : color.color, 1, false, true);
        resColors += `\n  static ${isGradient ? 'Gradient' : 'Color'} get ${name} => ${tempColor};`;
    });
    if (resColors == "") return "";
    return `class AppColors {${resColors}\n}`;
}

function exportColor(color, fillOpacity, withTag, isToClass, withConst) {
    withConst = withConst == null ? true : withConst;
    const isGradient = color.startX != null || color.gradientType != null;
    if (isGradient) {
        return exportGradient(color, fillOpacity, isToClass);
    }
    const opacity = fixDouble(fillOpacity * (color.a / 255));
    if (opacity == 0) return "Colors.transparent";
    const tag = withTag ? "color: " : "";
    const end = withTag ? "," : "";
    return tag + `${withConst ? 'const ' : ''}Color(${color.toHex(true).replace("#", "0xff")})${opacity != 1 ? `.withOpacity(${opacity})` : ""}` + end;
}

function exportGradient(color, fillOpacity, isToClass) {
    let stops = [];
    let colors = [];
    for (let i = 0; i < color.colorStops.length; i++) {
        let stop = color.colorStops[i];
        stops.push(fixDouble(stop["stop"]));
        colors.push(exportColor(stop["color"], fillOpacity));
    }
    colors = `colors: [${colors}],`;
    stops = stops.length == 2 ? "" : `stops: [${stops}],`;
    const type = _gradientType(color);
    const alignment = isToClass ? "" : type == "Radial" ? _radialAlignment(color) : _linearAlignment(color);
    return `${type}Gradient(${stops}${colors}${alignment})`;
}

function _gradientType(color) {
    let type = color.gradientType;
    if (color.gradientType == null) {
        if (color.startR != null) {
            type = "radial";
        } else {
            type = "linear";
        }
    };
    return type == "radial" ? "Radial" : "Linear";
}

function _radialAlignment(color) {
    return `radius: ${fixDouble(color.endR)},
    center: Alignment(${fixDouble(color.startX)}, ${fixDouble(color.startY)}),`;
}

function _linearAlignment(color) {
    return `begin: Alignment(${fixDouble(color.startX)}, ${fixDouble(color.startY)}),
    end: Alignment(${fixDouble(color.endX)}, ${fixDouble(color.endY)}),`;
}
module.exports = { onTapGenerateColor, generateColorClass, exportColor };
