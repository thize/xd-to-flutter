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
const { onTapExport } = require("../core/functions/export/export");
const { exportAppIcon } = require("../core/functions/export/app_icon");
const { precisionRowUi } = require("./components/precision_row_ui");


let panel;

function show(event) {
    if (!panel) {
        panel = document.createElement("div");
        panel.innerHTML =
            build_css() +
            outputUi() + '<hr>' +
            projectFolderUi() + '<hr>' +
            exportButtonsUi() + '<hr>' +
            exportToUi() + '<hr>' +
            // exportedCodePath() + '<hr>' +
            widgetsPrefixUi() + '<hr>' +
            precisionRowUi() + '<hr>' +
            exportTypeUi() + '<hr>' +
            exportWithCheckBoxsUi() + '<hr>';
        event.node.appendChild(panel);
        buildTaps();
    }
}

let oldItemsLengh;
function update() {
    // const singleColorButton = document.getElementById('singleColorButton');
    // const isToActiveSingleColorButton = items.length == 1 && (items[0].children.length == 0 || items[0].constructor.name == 'Artboard');
    // _changeButtonState(singleColorButton, isToActiveSingleColorButton);
    const items = scenegraph.selection.items;
    const selectionButton = document.getElementById('selectionButton');
    const iosIconButton = document.getElementById('iosIconButton');
    const androidIconButton = document.getElementById('androidIconButton');
    const isToActiveSelectionButton = items.length > 0;
    _changeButtonState(selectionButton, isToActiveSelectionButton);
    const isToActiveIosIconButton = items.length == 1;
    _changeButtonState(iosIconButton, isToActiveIosIconButton);
    const isToActiveAndroidIconButton = items.length == 1;
    _changeButtonState(androidIconButton, isToActiveAndroidIconButton);
    if (items.length == 0 && oldItemsLengh != 0) {
        changeOutputUiText('Nothing...', 'grey');
    }
    oldItemsLengh = items.length;
}

function buildTaps() {
    // let singleColorButton = document.getElementById('singleColorButton');
    // singleColorButton.onclick = _checkActive(singleColorButton, function () {
    //     onTapExport('SingleColor');
    // });
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
    let decrementPrecisionButton = document.getElementById('decrementPrecisionButton');
    decrementPrecisionButton.onclick = function () {
        let value = parseInt(document.getElementById('incrementText').innerHTML);
        value = value > 1 ? value - 1 : value;
        document.getElementById('incrementText').innerHTML = value.toString();
    };

    let incrementPrecisionButton = document.getElementById('incrementPrecisionButton');
    incrementPrecisionButton.onclick = function () {
        let value = parseInt(document.getElementById('incrementText').innerHTML);
        value = value < 9 ? value + 1 : value;
        document.getElementById('incrementText').innerHTML = value.toString();
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
