const { statelessWidget } = require("../../widgets/stateless");
const { generateWidgetFromItems } = require("../export/generate");
const { exportFiles } = require("../util/project_folder");
const { changeOutputUiText } = require("../../../ui/components/output_ui");
const scenegraph = require("scenegraph");
const { formatDart } = require("../util/format_dart");
const { copyToClipboard, exportTo } = require('../util/util');

function exportAllArtboards(artboards) {
    let fromSelection = artboards != null;
    if (!artboards) artboards = scenegraph.selection.editContext.children;
    const fileArtboardsName = [];
    const generatedArtboards = [];
    artboards.forEach(artboard => {
        fileArtboardsName.push(`${artboard.name}.dart`);
        generatedArtboards.push(statelessWidget(artboard.name, generateWidgetFromItems([artboard])));
    });
    if (fromSelection && exportTo() == 'clipboard') {
        let stringComponents = '';
        generatedArtboards.forEach((e) => stringComponents += e);
        stringComponents = formatDart(stringComponents);
        copyToClipboard(formatDart(stringComponents));
        changeOutputUiText('Artboards copied to clipboard');
    } else {
        changeOutputUiText('Exporting Artboard Dart Files');
        exportFiles(fileArtboardsName, generatedArtboards);
    }

}

module.exports = {
    exportAllArtboards: exportAllArtboards,
};