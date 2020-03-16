let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
const { Container } = require("./models/widgets/container");
const { generateLayout } = require("./layout");
const { formatDartCode } = require("./utils");

function run() {
    const items = removeItemsFromGroupFolders(scenegraph.selection.items);
    const widgets = generateWidgetsFromItems(items);
    const layout = generateLayout(widgets);
    let dartCode = formatDartCode(layout.toDart());
    clipboard.copyText(dartCode);
    console.log(`\n${dartCode}`);
}

function trim(x) {
    return x.replace(/\s/g, '', '');
}

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

module.exports = {
    run: run,
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
        if (itemName == 'Group' || itemName == 'Artboard') {
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
    return new Container(child);
}