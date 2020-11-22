const scenegraph = require("scenegraph");
const { build_css } = require("./css");
const { widgetsPrefixUi } = require("./components/widgets_prefix_ui");
const { outputUi, changeOutputUiText } = require("./components/output_ui");
const { projectFolderUi } = require("./components/project_folder_ui");
const { exportButtonsUi, copyButtonsUi, exportIconButtons } = require("./components/export_buttons_ui");
const { exportWithCheckBoxsUi } = require("./components/export_with_checkboxs_ui");
const { getFolderPath, changeProjectFolder } = require('../project_folder');
const { onTapGenerate } = require("../generate");
const { onTapGeneratePath } = require("../generate_path");
const { exportAppIcon } = require("../icon/functions");
const { numbersMethodName } = require("./components/numbers_method_name");
const { exportColor } = require("../color");
const { exportAll } = require("../export_all");
const { exportedCodePath } = require("./components/exported_code_path_ui");


let panel;

function show(event) {
    if (!panel) {
        panel = document.createElement("div");
        panel.innerHTML =
            build_css() +
            outputUi() + '<hr>' +
            copyButtonsUi() + '<hr>' +
            numbersMethodName() + '<hr>' +
            exportWithCheckBoxsUi() + '<hr>' +
            outputUi(true) + '<hr>' +
            exportButtonsUi() + '<hr>' +
            widgetsPrefixUi() + '<hr>' +
            projectFolderUi() + '<hr>' +
            exportedCodePath() + '<hr>' +
            exportIconButtons() + '<hr>';
        event.node.appendChild(panel);
        buildTaps();
    }
}

let oldItemsLengh;
function update() {

    const items = scenegraph.selection.items;
    const singleColorButton = document.getElementById('singleColorButton');
    const isToActiveSingleColorButton = items.length == 1 && (items[0].children.length == 0 || items[0].constructor.name == 'Artboard');
    _changeButtonState(singleColorButton, isToActiveSingleColorButton);
    const selectionButton = document.getElementById('selectionButton');
    const pathButton = document.getElementById('pathButton');
    const iosIconButton = document.getElementById('iosIconButton');
    const androidIconButton = document.getElementById('androidIconButton');
    const isToActiveSelectionButton = items.length > 0;
    _changeButtonState(selectionButton, isToActiveSelectionButton);
    const isToActivePathButton = items.length == 1 && items[0].constructor.name == 'Path';
    _changeButtonState(pathButton, isToActivePathButton);
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
    let singleColorButton = document.getElementById('singleColorButton');
    singleColorButton.onclick = _checkActive(singleColorButton, function () {
        exportColor();
    }, function () {
        changeOutputUiText('Select one item', 'red');
    });

    let selectionButton = document.getElementById('selectionButton');
    selectionButton.onclick = _checkActive(selectionButton, function () {
        onTapGenerate();
    }, function () {
        changeOutputUiText(`Select something`, 'red');
    });
    let pathButton = document.getElementById('pathButton');
    pathButton.onclick = _checkActive(pathButton, function () {
        onTapGeneratePath();
    }, function () {
        changeOutputUiText(`Select one path`, 'red');
    });
    let exportAllButton = document.getElementById('exportAllButton');
    exportAllButton.onclick = _checkActive(exportAllButton, function () {
        let exportAllRadio = document.querySelector('input[name="exportAllRadio"]:checked');
        exportAll(exportAllRadio.value);
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
    // let decrementPrecisionButton = document.getElementById('decrementPrecisionButton');
    // decrementPrecisionButton.onclick = function () {
    //     let value = parseInt(document.getElementById('incrementText').innerHTML);
    //     value = value > 1 ? value - 1 : value;
    //     document.getElementById('incrementText').innerHTML = value.toString();
    // };

    // let incrementPrecisionButton = document.getElementById('incrementPrecisionButton');
    // incrementPrecisionButton.onclick = function () {
    //     let value = parseInt(document.getElementById('incrementText').innerHTML);
    //     value = value < 9 ? value + 1 : value;
    //     document.getElementById('incrementText').innerHTML = value.toString();
    // };
}

function _checkActive(element, runFunction, elseFunction) {
    return function () {
        if (element.getAttribute('uxp-variant') == 'cta') {
            runFunction();
        } else {
            if (elseFunction) elseFunction();
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
