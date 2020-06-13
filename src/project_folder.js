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

async function exportFiles(filesNames, filesContents, type) {
    if (!_projectFolder) {
        changeOutputUiText(`Project folder not selected`, 'red');
    }
    const path = exportedCodePath();
    let libFolder;
    try {
        libFolder = await _projectFolder.getEntry(name);
    } catch (error) {
        libFolder = await _getNestedF(_projectFolder, path.split('/'));
    }
    for (let i = 0; i < filesNames.length; i++) {
        const file = await libFolder.createFile(filesNames[i], { overwrite: true });
        file.write(filesContents[i]);
    }
    changeOutputUiText(`Generated ${type} with Success`);
}

async function _getNestedF(parentF, names) {
    if (!parentF) { return null; }
    if (names.length == 0) return parentF;
    const name = names[0];
    console.log(`_getNestedF = ${names.length}`);
    let f;
    try {
        f = await parentF.getEntry(name);
        names.splice(0, 1);
    } catch (e) {
        f = await parentF.createFolder(name);
        names.splice(0, 1);
    }
    return names.length > 0 ? _getNestedF(f, names) : f;
}

function exportedCodePath() {
    const element = document.getElementById('exportedCode');
    const prefix = element != null ? element.value : '';
    if (prefix == null || prefix == '') {
        return 'lib/xd';
    }
    if (!prefix) return '';
    return prefix;
}

module.exports = {
    getFolderPath: getFolderPath,
    getFolder: getFolder,
    exportFiles: exportFiles,
    changeProjectFolder: changeProjectFolder,
};
