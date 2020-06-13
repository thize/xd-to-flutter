const scenegraph = require("scenegraph");
const clipboard = require("clipboard");
const { Artboard, SymbolInstance } = require("scenegraph");
const { itemsToDart } = require("./items_to_dart");
const { StatelessWidget } = require("./widgets/stateless");
const { formatDart } = require("./widgets/util/format_dart");
const { ComponentWidget } = require("./widgets/component");
const { listToString } = require("./util");
const { changeOutputUiText, getOutputUiText } = require("./ui/components/output_ui");

function onTapGenerate() {
    const items = scenegraph.selection.items;
    const hasSelection = items.length > 0;
    if (hasSelection) {
        changeOutputUiText('Nothing...', 'Grey');
        const firstItem = items[0];
        const isArtboard = firstItem instanceof Artboard;
        const isOnlyOneComponent = items.length == 1 && firstItem instanceof SymbolInstance;
        if (isOnlyOneComponent) {
            generateComponents(items, true);
        } else if (isArtboard) {
            generateArtboards(items);
        } else {
            generateSelection(items);
        }
        const text = getOutputUiText();
        if (text == 'Nothing...') {
            changeOutputUiText('Success');
        }
    } else {
        changeOutputUiText(`Nothing selected`, 'red');
    }
}

exports.onTapGenerate = onTapGenerate;

function generateComponents(components, isOnlyOneComponent = false) {
    const componentsWidget = [];
    components.forEach(component => {
        const dartCode = new ComponentWidget(component).toDartClass();
        componentsWidget.push(dartCode);
    });
    if (isOnlyOneComponent) {
        const dartCode = formatDart(listToString(componentsWidget));
        clipboard.copyText(dartCode);
    }
    componentsWidget.forEach((c, i) => {
        componentsWidget[i] = formatDart(c);
    });
    return componentsWidget;
}

exports.generateComponents = generateComponents;

function generateArtboards(artboards, toClipboard = true) {
    let artboardsWidget = [];
    artboards.forEach(artboard => {
        const dartCode = new StatelessWidget(artboard.name, itemsToDart([artboard], true)).toDart();
        artboardsWidget.push(dartCode);
    });
    if (toClipboard) {
        const dartCode = formatDart(listToString(artboardsWidget));
        clipboard.copyText(dartCode);
    } else {
        artboardsWidget.forEach((artboard, i) => {
            artboardsWidget[i] = formatDart(artboard);
        });
        return artboardsWidget;
    }
}

exports.generateArtboards = generateArtboards;

function generateSelection(items) {
    const dartCode = itemsToDart(items, true);
    clipboard.copyText(dartCode);
}

