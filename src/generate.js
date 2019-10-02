const { widgetText, widgetTextStyle } = require("./widgets/text");
const { widgetContainer } = require("./widgets/container");
const { widgetSvg } = require("./widgets/svg");
const { rotation } = require("./widgets/wrappers");
const { color, allOpacity } = require("./widgets/global");
const { showMessageWithColor } = require("./showMessage");

function generateWidget(node) {
    let widget;
    if (node.constructor.name == 'Text') {
        widget = widgetText(node);
    } else if (node.constructor.name == 'Rectangle' || node.constructor.name == 'Ellipse' || node.constructor.name == 'Line') {
        widget = widgetContainer(node);
    } else if (node.constructor.name == 'Path' || node.constructor.name == 'BooleanGroup') {
        widget = widgetSvg(node);
    } else {
        showMessageWithColor(`${node.constructor.name} not implemented yet`, "grey");
    }
    widget = rotation(node, widget);
    return widget;
}

function generateColor(node) {
    let hexColor;
    let json = {
        "color": node.fill["value"] != null ? node.fill.toHex(true) : node.fill,
        "colorOpacity": node.fill["value"] == null ? 1.0 : node.fill.a / 255,
        "opacity": node.opacity,
    };
    hexColor = color(json["color"], allOpacity(json["colorOpacity"], json["opacity"])).replace(",", "");
    return hexColor;
}

function generateTextStyle(node) {
    let textStyle = widgetTextStyle(node);
    return textStyle;
}

module.exports = { generateWidget, generateColor, generateTextStyle };