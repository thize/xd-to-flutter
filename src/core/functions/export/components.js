const { generateComponent } = require('./generate');
const scenegraph = require("scenegraph");
const { exportFiles } = require('../util/project_folder');
const { copyToClipboard, exportTo } = require('../util/util');
const { formatDart } = require('../util/format_dart');
const { changeOutputUiText } = require('../../../ui/components/output_ui');

async function exporComponentsFromAssetsPanel(components) {
    if (components == null) {
        components = [];
        const usedComponentsId = [];
        const artboards = scenegraph.selection.editContext.children;
        artboards.forEach(async artboard => {
            let isArtboard = artboard.constructor.name == "Artboard";
            if (isArtboard) {
                getComponentsFromGroup(artboard, components, usedComponentsId);
            }
        });
    }
    const fileComponentsName = [];
    const componentsWidgets = [];
    components.forEach(component => {
        const name = `${component.name}.dart`;
        fileComponentsName.push(name);
        componentsWidgets.push(generateComponent(component));
    });
    if (componentsWidgets.length > 0) {
        if (exportTo() == 'clipboard') {
            let stringComponents = '';
            componentsWidgets.forEach((e) => stringComponents += e);
            copyToClipboard(formatDart(stringComponents));
            changeOutputUiText('Components copied to clipboard');
        } else {
            changeOutputUiText('Exporting Components Dart Files');
            exportFiles(fileComponentsName, componentsWidgets);
        }
    } else {
        changeOutputUiText('No master components on Artboards', 'red');
    }

}

function getComponentsFromGroup(group, components, usedComponentsId) {
    group.children.forEach(async child => {
        const childName = child.constructor.name;
        const isSymbolInstance = childName == "SymbolInstance";
        const isNotIncluded = !usedComponentsId.includes(child.symbolId);
        const isMaster = child.isMaster;
        const isComponentMaster = isSymbolInstance && isNotIncluded && isMaster;
        if (isComponentMaster) {
            usedComponentsId.push(child.symbolId);
            components.push(child);
            getComponentsFromGroup(child, components, usedComponentsId);
        } else if (childName == "Group") {
            getComponentsFromGroup(child, components, usedComponentsId);
        }
    });
}

module.exports = {
    exporComponentsFromAssetsPanel: exporComponentsFromAssetsPanel,
};