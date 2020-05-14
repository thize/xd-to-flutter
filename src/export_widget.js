let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
let application = require("application");
const { Container } = require("./models/widgets/container");
const { Text } = require("./models/widgets/text");
const { InkWell } = require("./models/widgets/inkwell");
const { Svg } = require("./models/widgets/svg");
const { Layout } = require("./models/layout");
const { statelessWidget } = require("./models/widgets/utils/stateless");
const { Component } = require("./models/widgets/component");

async function exportWidget() {
    application.editDocument(async () => {
        let components = [];
        let dartCode = await exportSelectionItems(null, components);
        components = await generateComponents(components);
        dartCode = dartCode + '\n' + components;
        clipboard.copyText(dartCode);
    });
}

//TODO: gerar componentes dps de gerar a tela

async function exportSelectionItems(node, components) {
    const selection = node == null ? scenegraph.selection.items : node.children;
    const items = removeItemsFromGroupFolders(selection);
    const widgets = await generateWidgetsFromItems(items, components);
    const layout = new Layout(widgets);
    let dartCode = await layout.toDart();
    return dartCode;
}

async function generateComponents(components) {
    let widgets = '';
    let setWidgets = new Set([]);
    for (let index = 0; index < components.length; index++) {
        const component = components[index];
        const layout = new Layout([component]);
        setWidgets.add(await layout.toDart());
    }
    setWidgets.forEach(widget => {
        widgets += '\n ' + widget;
    });
    return widgets;
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
async function generateWidgetsFromItems(items, components) {
    const widgets = [];
    for (let i = 0; i < items.length; i++) {
        const child = items[i];
        widgets.push(await generateWidgetByType(child, components, items.length));
    }
    return widgets;
}

async function generateWidgetByType(child, components, itemsLength) {
    if (child.constructor.name == 'Text') return new Text(child);
    if (child.constructor.name == 'SymbolInstance') {
        const component = new Component(child, await exportSelectionItems(child, components));
        if (itemsLength > 1 && !containsComponent(child, components)) {
            components.push(component);
        }
        return component;
    }
    if (child.constructor.name == 'Path' || child.constructor.name == 'BooleanGroup' || child.constructor.name == 'Group') return new Svg(child);
    if (child.constructor.name == 'Group' && !child.name.includes('svg_') && child.triggeredInteractions[0] != null && child.triggeredInteractions[0].trigger.type == 'tap') return new InkWell(child);
    return new Container(child);
}


function containsComponent(component, allComponents) {
    let contains = false;
    allComponents.forEach(e => {
        contains = contains || e.node.symbolId == component.symbolId;
    });
    return contains;
}