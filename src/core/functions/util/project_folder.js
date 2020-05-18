const fs = require("uxp").storage.localFileSystem;

let _projectFolder = '';

function getFolder() {
    return _projectFolder;
}

async function changeProjectFolder() {
    let folder = await fs.getFolder();
    if (!folder) { return; }
    _projectFolder = folder.nativePath;
    console.log(`_projectFolder = ${_projectFolder}`);
}

module.exports = {
    getFolder: getFolder,
    changeProjectFolder: changeProjectFolder,
};
