const scenegraph = require("scenegraph");
const { build_css } = require("./css");
const { widgetsPrefixUi } = require("./components/widgets_prefix_ui");
const { exportTypeUi } = require("./components/export_type_ui");
const { exportToUi } = require("./components/export_to_ui");
const { projectFolderUi } = require("./components/project_folder_ui");
const { exportedCodePath } = require("./components/exported_code_path_ui");
const { exportButtonsUi } = require("./components/export_buttons_ui");
const { exportWithCheckBoxsUi } = require("./components/export_with_checkboxs_ui");
const { changeProjectFolder } = require("../core/functions/project_folder");
const { getFolder } = require('../core/functions/project_folder');

let panel;

function show(event) {
    if (!panel) {
        panel = document.createElement("div");
        panel.innerHTML =
            build_css() +
            exportButtonsUi() + '<hr>' +
            projectFolderUi() + '<hr>' +
            exportedCodePath() + '<hr>' +
            widgetsPrefixUi() + '<hr>' +
            exportTypeUi() + '<hr>' +
            exportToUi() + '<hr>' +
            exportWithCheckBoxsUi() + '<hr>';
        event.node.appendChild(panel);
        buildTaps();
    }
}

function update() {
    const items = scenegraph.selection.items;
    const singleColorButton = document.getElementById('singleColorButton');
    if (items.length == 1 && (items[0].children.length == 0 || items[0].constructor.name == 'Artboard')) {
        singleColorButton.setAttribute("uxp-variant", "cta");
    } else {
        singleColorButton.setAttribute("uxp-variant", "");
    }
}

function buildTaps() {
    let singleColorButton = document.getElementById('singleColorButton');
    singleColorButton.onclick = _checkActive(singleColorButton, function () {
        console.log('singleColorButton on');
    });
    let exportAllButton = document.getElementById('exportAllButton');
    exportAllButton.onclick = _checkActive(exportAllButton, function () {
        let exportAllRadio = document.querySelector('input[name="exportAllRadio"]:checked');
        console.log('exportAllRadio.value = ' + exportAllRadio.value);
    });
    let changeProjectFolderButton = document.getElementById('changeProjectFolderButton');
    changeProjectFolderButton.onclick = async function () {
        await changeProjectFolder();
        const projectFolderInput = document.getElementById('projectFolderInput');
        projectFolderInput.value = getFolder();
    };
}

function _checkActive(element, runFunction) {
    return function () {
        if (element.getAttribute('uxp-variant') == 'cta') {
            runFunction();
        } else {
            console.log('Button is not activated');
        }
    }
}

module.exports = {
    show: show,
    update: update,
};
