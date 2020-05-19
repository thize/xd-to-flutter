const { statelessWidget } = require("../../widgets/stateless");
const { generateWidgetFromItems } = require("../export/generate");
const { exportFiles } = require("../util/project_folder");
const { changeOutputUiText } = require("../../../ui/components/output_ui");
const scenegraph = require("scenegraph");
const { formatDart } = require("../util/format_dart");
const { copyToClipboard } = require('../util/util');

function exportAllArtboards(artboards) {
    if (!artboards) artboards = scenegraph.selection.editContext.children;
    const fileArtboardsName = [];
    const generatedArtboards = [];
    artboards.forEach(async artboard => {
        fileArtboardsName.push(`${artboard.name}.dart`);
        generatedArtboards.push(statelessWidget(artboard.name, generateWidgetFromItems([artboard])));
    });
    changeOutputUiText('Exporting Artboard Dart Files');
    exportFiles(fileArtboardsName, generatedArtboards);
    let stringComponents = '';
    generatedArtboards.forEach((e) => stringComponents += e);
    stringComponents = formatDart(stringComponents);
    copyToClipboard(formatDart(stringComponents));

}

module.exports = {
    exportAllArtboards: exportAllArtboards,
};