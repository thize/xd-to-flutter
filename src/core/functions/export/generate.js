const { statelessWidget } = require("../../widgets/stateless");
const { formatDart } = require("../util/format_dart");
const { Layout } = require("../../widgets/layout");
const { Container } = require("../../widgets/models/container");
const { Text } = require("../../widgets/models/text");
const { InkWell } = require("../../widgets/models/inkwell");
const { Svg } = require("../../widgets/models/svg");
const { Artboard } = require("../../widgets/models/artboard");
const { Component } = require("../../widgets/models/component");
const { wrapWithInkWell } = require("../../widgets/models/inkwell");

function generateWidgetFromItems(items) {
    let dartCode = generateWidget(items);
    dartCode = dartCode;
    return dartCode;
}

function generateComponent(component) {
    let widget = generateWidgetFromItems(component.children);
    widget = wrapWithInkWell(component, widget);
    const generatedClass = formatDart(statelessWidget(component.name, widget));
    return generatedClass;
}

module.exports = {
    generateWidgetFromItems: generateWidgetFromItems,
    generateComponent: generateComponent,
};

function generateWidget(itemsList) {
    const items = removeItemsFromGroupFolders(itemsList);
    const widgets = generateWidgetsFromItems(items);
    const layout = new Layout(widgets);
    let dartCode = layout.toDart();
    return dartCode;
}

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
            if (itemName == 'Artboard' || (item.triggeredInteractions[0] != null && item.triggeredInteractions[0].trigger.type == 'tap')) {
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
    for (let i = 0; i < items.length; i++) {
        const child = items[i];
        const widget = generateWidgetByType(child);
        widgets.push(widget);
    }
    return widgets;
}

function generateWidgetByType(child) {
    if (child.constructor.name == 'Text') return new Text(child);
    if (child.constructor.name == 'SymbolInstance') return new Component(child);
    if (child.constructor.name == 'Artboard') return new Artboard(child);
    if (child.constructor.name == 'Group' && !child.name.includes('svg_') && child.triggeredInteractions[0] != null && child.triggeredInteractions[0].trigger.type == 'tap') return new InkWell(child);
    if (child.constructor.name == 'Path' || child.constructor.name == 'Polygon' || child.constructor.name == 'BooleanGroup' || child.constructor.name == 'Group') return new Svg(child);
    return new Container(child);
}