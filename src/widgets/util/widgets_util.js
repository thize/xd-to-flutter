const { InkWellWidget } = require("../inkwell");
const { SvgWidget } = require("../svg");

function cleanVarName(name, isToCapitalize) {
    if (!name) { return ''; }
    name = name.replace(/^[\W\d]+|\W/ig, '');
    if (isToCapitalize) {
        return capitalize(name);
    }
    return name;
}

exports.cleanVarName = cleanVarName;

function capitalize(str) {
    return str[0].toUpperCase() + str.substr(1);
}

exports.capitalize = capitalize;

function wrapWithInkWell(node, widget) {
    const isInkWell = !node ? false : node.triggeredInteractions[0] != null && node.triggeredInteractions[0].trigger.type == 'tap';
    if (isInkWell) {
        widget = new InkWellWidget(node).toDart(widget);
    }
    return widget;
}

exports.wrapWithInkWell = wrapWithInkWell;

function wrapWithRotation(node, widget) {
    if (node.widget instanceof SvgWidget) return widget;
    const thisRotation = node.widget.xdNode == null ? 0 : node.widget.xdNode.rotation;
    const fatherTotalRotation = !node.father ? 0 : getWidgetTotalRotation(node.father);
    const { fix } = require("../../util");
    const rotation = fix(thisRotation - fatherTotalRotation);
    if (rotation == 0) return widget;
    return `Transform.rotate(
        angle: ${rotation} * pi / 180,
        child: ${widget},
    )`;
}

exports.wrapWithRotation = wrapWithRotation;

function getWidgetTotalRotation(node) {
    if (node.widget.xdNode == null) return 0;
    let totalRotation = node.widget.xdNode.rotation;
    return totalRotation;
}

exports.getWidgetTotalRotation = getWidgetTotalRotation;

function titleCase(str) {
    str = str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    ).split('\\N').join('\\n');;
    return str.replace(
        /\\n./g,
        function (txt) {
            return txt.substr(0, txt.length - 1) + txt.charAt(txt.length - 1).toUpperCase();
        }
    );
}

exports.titleCase = titleCase;