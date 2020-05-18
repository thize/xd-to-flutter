const { exportWidget } = require("../export_widget");
const { exportAppIcon } = require("../export_app_icon");
let scenegraph = require("scenegraph");
let panel;

//! [OnTaps]

function onTapExportIos() {
    exportAppIcon('ios');
}

function onTapExportAndroid() {
    exportAppIcon('android');
}

function onTapExportWidget() {
    exportWidget();
}

//! [Panel Ui]

function update() {
    const selection = scenegraph.selection;
    const buttons = document.querySelectorAll("button");
    buttons.forEach(function (button) {
        if (button.id == "button") {
            if (selection.items.length != 0) {
                button.setAttribute("uxp-variant", "cta");
            } else {
                button.setAttribute("uxp-variant", "");
            }
        }
    });
}

function show(event) {
    if (!panel) {
        panel = document.createElement("div");
        panel.innerHTML = generateHtml();
        panel.querySelector("#ExportForm").addEventListener("submit", function () {
            onTapExportWidget();
        });
        panel.querySelector("#ExportIosIconForm").addEventListener("submit", function () {
            onTapExportIos();
        });

        panel.querySelector("#ExportAndroidIconForm").addEventListener("submit", function () {
            onTapExportAndroid();
        });
        event.node.appendChild(panel);
    }
}

module.exports = {
    show: show,
    update: update,
    generateHtml: generateHtml,
};


function generateHtml() {
    return `
    <style>.hidden {opacity: 0.0;} .center {text-align: center;display: flex;justify-content: center;}</style>
    ${spacer}
    ${widget}    
  `;
}

const spacer = `<h2></h2><h2></h2><h2></h2>`;

const exporIosIconForm = `
<form id= "ExportIosIconForm">
${_row(`<button id="button" type="submit">Export IOS Icons</button>`)}
</form>`;

const exportAndroidIconForm = `
<form id= "ExportAndroidIconForm">
${_row(`<button id="button" type="submit">Export Android Icons</button>`)}
</form>`;

const widget = `
<h2>Widget</h2>
<form id= "ExportForm">
${_row(`<input type="radio" id="widget" name="exportGroup" checked>Widget<br>`)}
${_row(`<h2 id="messageWidget" style="color:green;" align="center"></h2>`)}
${_row(`<button id="button" type="submit">Generate</button>`)}
</form>
${exportAndroidIconForm}
${exporIosIconForm}
`;


function _row(content) {
    return `<label class="row">${content}</label>`;
}

