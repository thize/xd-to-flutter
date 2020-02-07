const { generateColorClass } = require("./generateColor");
const { generateStyleClass } = require("./generateStyle");
const { generateWidget } = require("./generateWidget/generateWidget");
const { statelessWidget, fixName } = require("./util");
const { showMessageWithColor } = require("./showMessageWithColor");
let scenegraph = require("scenegraph");
let clipboard = require("clipboard");

function onTapGenerateGlobal(type) {
    require("application").editDocument(async () => {
        let result;
        if (type == 'Colors') {
            result = generateColorClass();
        } else if (type == 'Text Styles') {
            result = generateStyleClass();
        } else {
            result = await generateComponents();
        }
        clipboard.copyText(result);
        if (result == '') {
            showMessageWithColor(`Global ${type} is empty`, "red", "messageGlobal");
        } else {
            showMessageWithColor("Copied to clipboard", "green", "messageGlobal");
        }
    });
}

async function generateComponents() {
    const components = [];
    const usedComponentsId = [];
    const artboards = scenegraph.selection.editContext.children;
    const promises = artboards.map(async artboard => {
        let isArtboard = artboard.constructor.name == "Artboard";
        if (isArtboard) {
            await _generateComponent(artboard, components, usedComponentsId);
        }
    });
    await Promise.all(promises);
    let componentsResult = '';
    components.forEach(component => {
        componentsResult = `${componentsResult}${component}\n`;
    });
    return componentsResult;
}


async function _generateComponent(artboard, components, usedComponentsId) {
    const promises = artboard.children.map(async (item) => {
        const isSymbolInstance = item.constructor.name == "SymbolInstance";
        const isNotIncluded = !usedComponentsId.includes(item.symbolId);
        const isMaster = item.isMaster;
        const isComponentMaster = isSymbolInstance && isNotIncluded && isMaster;
        if (isComponentMaster) {
            usedComponentsId.push(item.symbolId);
            const componentWidget = await generateWidget(item);
            components.push(statelessWidget(fixName(item.name), componentWidget));
        } else if (item.constructor.name == "Group") {
            await _generateComponent(item, components, usedComponentsId);
        }
    });
    await Promise.all(promises);
}

module.exports = { onTapGenerateGlobal };