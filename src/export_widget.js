let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
const { Container } = require("./models/widgets/container");
const { Text } = require("./models/widgets/text");
const { Svg } = require("./models/widgets/svg");
const { Layout } = require("./models/layout");
const { formatDart } = require("./dart_style");

async function exportWidget() {
    const items = removeItemsFromGroupFolders(scenegraph.selection.items);
    const widgets = generateWidgetsFromItems(items);
    const layout = new Layout(widgets);
    let dartCode = layout.toDart() + ';';
    dartCode = formatDart(dartCode, true);
    dartCode = "  " + dartCode;
    clipboard.copyText(dartCode);
}

module.exports = {
    exportWidget: exportWidget,
};


/**
* Recursive function to remove items from Group folders
* 
* @param {[any]} items initial: scenegraph.selection.items
* @return {[any]} list of all selection items without Groups
*/
function removeItemsFromGroupFolders(items) {
    let removedItems = [];
    items.forEach(item => {
        const itemName = item.constructor.name;
        if (itemName == 'Group' && item.name.includes('svg_')) {
            removedItems.push(item);
        } else if (itemName == 'Group' || itemName == 'Artboard') {
            if (itemName == 'Artboard') {
                removedItems.push(item);
            }
            removeItemsFromGroupFolders(item.children).forEach(child => {
                removedItems.push(child);
            });
        } else {
            removedItems.push(item);
        }
    });
    return removedItems;
}

/**
* Generate widgets from selection items
* 
* @param {[any]} items all selection items
* @return {[any]} list of all selection items to widgets
*/
function generateWidgetsFromItems(items) {
    const widgets = [];
    items.forEach(child => widgets.push(generateWidgetByType(child)));
    return widgets;
}

function generateWidgetByType(child) {
    if (child.constructor.name == 'Text') return new Text(child);
    if (child.constructor.name == 'Path' || child.constructor.name == 'BooleanGroup' || child.constructor.name == 'Group') return new Svg(child);
    return new Container(child);
}