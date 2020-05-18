const scenegraph = require("scenegraph");
const { build_css } = require("./css");
const { widgetsPrefixUi } = require("./components/widgets_prefix_ui");
const { exportTypeUi } = require("./components/export_type_ui");
const { outputUi, changeOutputUiText } = require("./components/output_ui");
const { exportToUi } = require("./components/export_to_ui");
const { projectFolderUi } = require("./components/project_folder_ui");
const { exportedCodePath } = require("./components/exported_code_path_ui");
const { exportButtonsUi } = require("./components/export_buttons_ui");
const { exportWithCheckBoxsUi } = require("./components/export_with_checkboxs_ui");
const { getFolderPath, changeProjectFolder } = require('../core/functions/util/project_folder');
const { onTapExport } = require("../core/functions/export");
const { exportAppIcon } = require("../core/functions/app_icon");

let panel;

function show(event) {
    if (!panel) {
        panel = document.createElement("div");
        panel.innerHTML =
            build_css() +
            outputUi() + '<hr>' +
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
    const selectionButton = document.getElementById('selectionButton');
    const iosIconButton = document.getElementById('iosIconButton');
    const androidIconButton = document.getElementById('androidIconButton');
    const isToActiveSelectionButton = items.length > 0;
    _changeButtonState(selectionButton, isToActiveSelectionButton);
    const isToActiveSingleColorButton = items.length == 1 && (items[0].children.length == 0 || items[0].constructor.name == 'Artboard');
    _changeButtonState(singleColorButton, isToActiveSingleColorButton);
    const isToActiveIosIconButton = items.length == 1;
    _changeButtonState(iosIconButton, isToActiveIosIconButton);
    const isToActiveAndroidIconButton = items.length == 1;
    _changeButtonState(androidIconButton, isToActiveAndroidIconButton);
    if (items.length == 0)
        changeOutputUiText('Nothing...', 'grey');
}

function buildTaps() {
    let singleColorButton = document.getElementById('singleColorButton');
    singleColorButton.onclick = _checkActive(singleColorButton, function () {
        onTapExport('SingleColor');
    });
    let selectionButton = document.getElementById('selectionButton');
    selectionButton.onclick = _checkActive(selectionButton, function () {
        onTapExport('Selection');
    });
    let exportAllButton = document.getElementById('exportAllButton');
    exportAllButton.onclick = _checkActive(exportAllButton, function () {
        let exportAllRadio = document.querySelector('input[name="exportAllRadio"]:checked');
        onTapExport(exportAllRadio.value);
    });
    let changeProjectFolderButton = document.getElementById('changeProjectFolderButton');
    changeProjectFolderButton.onclick = async function () {
        await changeProjectFolder();
        const projectFolderInput = document.getElementById('projectFolderInput');
        projectFolderInput.value = getFolderPath();
    };
    let iosIconButton = document.getElementById('iosIconButton');
    iosIconButton.onclick = function () {
        exportAppIcon('ios');
    };
    let androidIconButton = document.getElementById('androidIconButton');
    androidIconButton.onclick = function () {
        exportAppIcon('android');
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

function _changeButtonState(element, isToActive) {
    if (isToActive) {
        element.setAttribute("uxp-variant", "cta");
    } else {
        element.setAttribute("uxp-variant", "");
    }
}

module.exports = {
    show: show,
    update: update,
};
