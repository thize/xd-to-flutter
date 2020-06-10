const scenegraph = require("scenegraph");
const clipboard = require("clipboard");
const { Artboard, SymbolInstance } = require("scenegraph");
const { itemsToDart } = require("./src/items_to_dart");
const { StatelessWidget } = require("./src/widgets/stateless");
const { formatDart } = require("./src/widgets/util/format_dart");
const { findMasterForSymbolId } = require("./src/util");

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
            generateSelection(items);
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

function generateComponents(components) {
    const componentsWidget = [];
    components.forEach(component => {
        const master = findMasterForSymbolId(component.symbolId);
        const componentName = master.name;
        const dartCode = new StatelessWidget(componentName, itemsToDart([component])).toDart();
        componentsWidget.push(dartCode);
    });
    let stringComponents = '';
    componentsWidget.forEach(componentWidget => {
        stringComponents += '\n' + componentWidget;
    });
    stringComponents = formatDart(stringComponents);
    clipboard.copyText(stringComponents);
}

function generateArtboards(artboards) {
    const artboardsWidget = [];
    artboards.forEach(artboard => {
        const dartCode = new StatelessWidget(artboard.name, itemsToDart([artboard])).toDart();
        artboardsWidget.push(dartCode);
    });
    let stringArtboards = '';
    artboardsWidget.forEach(artboardWidget => {
        stringArtboards += '\n' + artboardWidget;
    });
    stringArtboards = formatDart(stringArtboards);
    clipboard.copyText(stringArtboards);
}

function generateSelection(items) {
    const dartCode = formatDart(itemsToDart(items) + ";");
    clipboard.copyText(dartCode);
}
