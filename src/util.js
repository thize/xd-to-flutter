const scenegraph = require("scenegraph");
const { Path, Line, Group, Polygon, BooleanGroup, Artboard, ImageFill, RepeatGrid, SymbolInstance, Text } = require("scenegraph");
const { ArtboardWidget } = require("./widgets/artboard");
const { ComponentWidget } = require("./widgets/component");
const { ContainerWidget } = require("./widgets/container");
const { GroupWidget } = require("./widgets/group");
const { GridWidget } = require("./widgets/grid");
const { ImageWidget } = require("./widgets/image");
const { InkWellWidget } = require("./widgets/inkwell");
const { SvgWidget } = require("./widgets/svg");
const { TextWidget } = require("./widgets/text");
const { MaskWidget } = require("./widgets/mask");

function fix(num, digits = 2) {
    let p = Math.pow(10, digits);
    num = Math.round(num * p) / p;
    return num + (num === (num | 0) ? '.0' : '');
}

exports.fix = fix;

function _isSvgLine(item) {
    return item instanceof Line && item.globalBounds.width != 0 && item.globalBounds.height != 0;
}

function isSvgFolder(item) {
    let onlySvg = true;
    item.children.forEach(child => {
        if (onlySvg) {
            if (child instanceof Group) {
                onlySvg = isSvgFolder(child);
            } else {
                const isPath = child instanceof Path;
                const isPolygon = child instanceof Polygon;
                const isBooleanGroup = child instanceof BooleanGroup;
                const isSvgLine = _isSvgLine(child);
                onlySvg = (isPath || isPolygon || isBooleanGroup || isSvgLine);
            }
        }
    });
    return onlySvg;
}

exports.isSvgFolder = isSvgFolder;

function hasInteraction(item) {
    const hasInteraction = item.triggeredInteractions[0] != null && item.triggeredInteractions[0].trigger.type == 'tap';
    return hasInteraction;
}

exports.hasInteraction = hasInteraction;

function xdItemToWidget(item) {
    const isImage = item.fill instanceof ImageFill;
    if (isImage) return new ImageWidget(item);
    const isGrid = item instanceof RepeatGrid;
    if (isGrid) return new GridWidget(item);
    const isInkWell = item instanceof Group && !item.name.includes('svg_') && item.triggeredInteractions[0] != null && item.triggeredInteractions[0].trigger.type == 'tap';
    if (isInkWell) return new InkWellWidget(item);
    const isSvg = (item instanceof Group && isSvgFolder(item)) || item instanceof Path || item instanceof Polygon || item instanceof BooleanGroup || _isSvgLine(item);
    if (isSvg) return new SvgWidget(item);
    const isGroup = item instanceof Group;
    const isMaskGroup = isGroup && item.mask;
    if (isMaskGroup) return new MaskWidget(item);
    if (isGroup) return new GroupWidget(item);
    const isComponent = item instanceof SymbolInstance;
    if (isComponent) return new ComponentWidget(item);
    const isArtboard = item instanceof Artboard;
    if (isArtboard) return new ArtboardWidget(item);
    const isText = item instanceof Text;
    if (isText) return new TextWidget(item);
    return new ContainerWidget(item);
}

exports.xdItemToWidget = xdItemToWidget;

function widgetCanHaveChild(widget) {
    const isGrid = widget instanceof GridWidget;
    const isSvg = widget instanceof SvgWidget;
    const isComponent = widget instanceof ComponentWidget;
    const isText = widget instanceof TextWidget;
    const isGroup = widget instanceof GroupWidget;
    const isAWidgetThatCannotHaveChild = isGrid || isSvg || isComponent || isText || isGroup;
    return !isAWidgetThatCannotHaveChild;
}

exports.widgetCanHaveChild = widgetCanHaveChild;

function removeItemsFromGroup(items) {
    let removedItems = [];
    items.forEach(item => {
        const isGroup = item instanceof Group;
        const isArtboard = item instanceof Artboard;
        const isSvgGroup = isGroup && (item.name.includes('svg_') || isSvgFolder(item));
        const isMaskGroup = isGroup && item.mask;
        if (isSvgGroup || isMaskGroup) {
            removedItems.push(item);
        } else if (isArtboard /* || isGroup */) {
            // if (isArtboard) {
            removedItems.push(item);
            // }
            removeItemsFromGroup(item.children).forEach(child => {
                removedItems.push(child);
            });
        } else {
            removedItems.push(item);
        }
    });
    return removedItems;
}

exports.removeItemsFromGroup = removeItemsFromGroup;

function findMasterForSymbolId(symbolId, xdNode) {
    let result = null;
    if (!xdNode) {
        xdNode = scenegraph.selection.editContext;
    }
    if (xdNode instanceof SymbolInstance) {
        if (xdNode.isMaster && xdNode.symbolId === symbolId) {
            result = xdNode;
        }
    }
    xdNode.children.forEach((child) => {
        if (!result) result = findMasterForSymbolId(symbolId, child);
    });
    return result;
}

exports.findMasterForSymbolId = findMasterForSymbolId;

function listToString(list) {
    var string = '';
    list.forEach(item => {
        string += '\n' + item;
    });
    return string;
}

exports.listToString = listToString;

function getOpacity(xdNode) {
    let o = xdNode, opacity = 1.0;
    while (o) {
        if (o.opacity != null) { opacity *= o.opacity; }
        o = o.parent;
    }
    return opacity;
}

exports.getOpacity = getOpacity;

function fixAllNumbers(str) {
    const onlyFloatNumbers = `\\-?\\d+\\.\\d+`;
    str = str.replace(new RegExp(onlyFloatNumbers, 'g'), (value) => {
        return fix(value);
    });
    return str;
}

exports.fixAllNumbers = fixAllNumbers;

function putSimpleCode(str) {
    const getNumberRegex = '[0-9]+([\\.][0-9]+)?';
    str = _applySCRegexWithTag(str, getNumberRegex, 'width');
    str = _applySCRegexWithTag(str, getNumberRegex, 'height');
    str = _applySCRegexWithTag(str, getNumberRegex, 'fontSize');
    str = _applySCRegexWithTag(str, getNumberRegex, 'blurRadius');
    str = _applySCRegexWithTag(str, getNumberRegex, 'right');
    str = _applySCRegexWithTag(str, getNumberRegex, 'left');
    str = _applySCRegexWithTag(str, getNumberRegex, 'top');
    str = _applySCRegexWithTag(str, getNumberRegex, 'bottom');
    str = _applySCRegexWithTag(str, getNumberRegex, null, 'Offset');
    str = _applySCRegexWithTag(str, getNumberRegex, null, 'circular');
    return str;
}

exports.putSimpleCode = putSimpleCode;

function _applySCRegexWithTag(str, regex, tag, method) {
    if (method)
        return str.replace(new RegExp(method + '(.*)', 'g'), (value) => {
            value = value.replace(new RegExp(regex, 'g'), (number) => {
                if (number == 0) return number;
                return `wsz(` + number + ')';
            });
            return value;
        });
    return str.replace(new RegExp(tag + ': ' + regex, 'g'), (value) => {
        var matches_array = value.match(regex);
        if (matches_array[0] == 0) return value;
        return tag + ': wsz(' + matches_array[0] + ')';
    });
}