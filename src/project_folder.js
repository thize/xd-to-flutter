const { changeOutputUiText } = require("./ui/components/output_ui");

const fs = require("uxp").storage.localFileSystem;

let _projectFolder;

function getFolderPath() {
    if (_projectFolder == null) {
        return '';
    }
    return _projectFolder.nativePath;
}

function getFolder() {
    return _projectFolder;
}

async function changeProjectFolder() {
    let folder = await fs.getFolder();
    if (!folder) { return; }
    _projectFolder = folder;
}

async function exportFiles(filesNames, filesContents) {
    if (!_projectFolder) {
        changeOutputUiText(`Project folder not selected`, 'red');
    }
}

module.exports = {
    getFolderPath: getFolderPath,
    getFolder: getFolder,
    exportFiles: exportFiles,
    changeProjectFolder: changeProjectFolder,
};
