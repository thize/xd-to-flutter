const scenegraph = require("scenegraph");
const clipboard = require("clipboard");
const { Artboard, SymbolInstance } = require("scenegraph");
const { itemsToDart } = require("./src/items_to_dart");
const { formatDart } = require("./src/widgets/util/format_dart");

function onTapGenerate() {
    const items = scenegraph.selection.items;
    const hasSelection = items.length > 0;
    if (hasSelection) {
        const firstItem = items[0];
        const isArtboard = firstItem instanceof Artboard;
        const isOnlyOneComponent = items.length == 1 && firstItem instanceof SymbolInstance;
        if (isOnlyOneComponent) {
            generateComponents(items);
        } else if (isArtboard) {
            generateArtboards(items);
        } else {
            const dartCode = formatDart(itemsToDart(items) + ";");
            console.log(dartCode);
            clipboard.copyText(dartCode);
        }
    } else {
        console.log(`Nothing selected`);
    }
}

module.exports = {
    commands: {
        onTapGenerate: onTapGenerate
    }
};


function generateArtboards(artboards) {
    const dartCode = formatDart(itemsToDart([artboards[0]]) + ";");
    console.log(dartCode);
    clipboard.copyText(dartCode);
}

function generateComponents(components) {
    console.log('generateComponents');
    // const componentsWidgets = [];
    // components.forEach(component => {
    //     let widget = generateWidgetFromItems(component.children);
    //     widget = wrapWithInkWell(component, widget);
    //     const generatedComponent = formatDart(statelessWidget(component.name, widget));
    //     componentsWidgets.push(generatedComponent);
    // });
    // let stringComponents = '';
    // componentsWidgets.forEach((e) => stringComponents += e);
    // return stringComponents;
}