const folderIconPath = '../../images/folder.png';
const { getFolder } = require('../../core/functions/util/project_folder');

function projectFolderUi() {
    const title = '<H2>Project Folder</H2>';
    const button = `<button uxp-variant="action" id="changeProjectFolderButton" /><img src="${folderIconPath}"></button>`;
    const input = `<input class="uiTextFieldWithButton" id="projectFolderInput" value="${getFolder()}" readonly="readonly" type="TextField" name="projectFolder"> `;
    return title + button + input;
}

module.exports = {
    projectFolderUi: projectFolderUi,
};
