let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
const { Container } = require("./models/widgets/container");
const { Text } = require("./models/widgets/text");
const { generateLayout } = require("./layout");

async function exportWidget() {
    const items = removeItemsFromGroupFolders(scenegraph.selection.items);
    const widgets = generateWidgetsFromItems(items);
    const layout = generateLayout(widgets);
    let dartCode = formatDartCode(layout.toDart());
    console.log(layout.no.debug(0));
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
    if (child.constructor.name == 'Text') return new Text(child);
    return new Container(child);
}
/**
* Indent Dart Code
* @param {string} dartCode
* @return {string} Indented Dart Code
*/
function formatDartCode(dartCode, inside) {
    if (inside == null) inside = 0;
    let parenthesis = dartCode.indexOf("(");
    let bracket = dartCode.indexOf("[");
    if (parenthesis == -1 && bracket == -1) {
        return dartCode;
    }
    if (parenthesis == -1) parenthesis = bracket + 1;
    if (bracket == -1) bracket = parenthesis + 1;
    let search = ')';
    let front = '(';
    let ini = parenthesis + 1;
    if (bracket < parenthesis) {
        search = ']';
        front = '[';
        ini = bracket + 1;
    }
    let end = -1;
    let inFront = 0;
    for (let i = ini; i < dartCode.length; i++) {
        const char = dartCode[i];
        if (char == front) {
            inFront++;
        } else if (char == search) {
            if (inFront == 0) {
                end = i; break;
            }
            inFront--;
        }
    }

    let mid = dartCode.substring(ini, end);
    if (mid[mid.length - 1] == ',') {
        return (tab(inside) + dartCode.substring(0, ini) + '\n' + formatDartCode(mid, inside + 1) + '\n' + tab(inside) + dartCode.substring(end, dartCode.length));
    }
    return dartCode;
}

function tab(inside) {
    let value = '';
    for (let i = 0; i < inside; i++) {
        value += '  ';
    }
    return value;
}

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function replaceInRange(string, start, end, replace) {
    return string.substring(0, start) + replace + string.substring(end, string.length);
}

/*
Column(children: [Container(height: 18,width: 59,decoration: BoxDecoration(color: Colors.white,borderRadius: BorderRadius.circular(42),),),Container(height: 18,width: 59,color: Colors.white,),],)
*/