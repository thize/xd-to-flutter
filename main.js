const { exportColor } = require("./src/app/exportColor");
const { exportWidget } = require("./src/app/exportWidget");
const { isEmptyMethodName, isSingleItem, showMessageWithColor, copyToClipboard, isNotEmptySelectionItens } = require("./src/util");
let scenegraph = require("scenegraph");
let panel;
let showAutomaticButton = false;
let showPlugins = true;

function onTapGenerate(selection) {
    const widget = document.querySelector("#widget").checked;
    const color = document.querySelector("#color").checked;
    const simpleCode = document.querySelector("#simpleCodeCheckbox").checked;
    const division = document.querySelector("#division").checked;
    let generatedWidget = "";
    try {
        if (widget) {
            require("application").editDocument(async () => {
                try {
                    generatedWidget = await exportWidget(selection, simpleCode, division);
                    copyToClipboard(generatedWidget)
                } catch (error) {
                    currentlyNotSupported(error);
                }
            });
        } else if (color && isSingleItem(selection)) {
            generatedWidget = exportColor(selection.items[0]);
            copyToClipboard(generatedWidget)
        } else {
            throw "Select only one widget";
        }
        showMessageWithColor("Successfully generated", "green");
    } catch (error) {
        currentlyNotSupported(error);
    }
}

function currentlyNotSupported(error) {
    showMessageWithColor(error.toString().includes('TypeError') ? "Selected object is currently not supported" : error, "red");
}

module.exports = {
    panels: {
        createWidgets: {
            show,
            update
        }
    },
};

function create() {
    panel = document.createElement("div");
    panel.innerHTML = generateHtml();
    panel.querySelector("#ExportForm").addEventListener("submit", function () {
        const selection = scenegraph.selection;
        if (isNotEmptySelectionItens(selection)) {
            onTapGenerate(selection);
        } else {
            showMessageWithColor("Select something", "grey");
        }
    });
    return panel;
}

function update() {
    const selection = scenegraph.selection;
    const buttons = document.querySelectorAll("button");
    buttons.forEach(function (button) {
        if (selection.items.length != 0) {
            button.setAttribute("uxp-variant", "cta");
        } else {
            button.setAttribute("uxp-variant", "");
        }
    });
}

function show(event) {
    if (!panel) event.node.appendChild(create());
}

function generateHtml() {
    return `
  <style>.hidden {opacity: 0.0;} .center {text-align: center;display: flex;justify-content: center;}</style>
  ${exportForm}
  <div class="center">
    <h2 id="message" style="color:green;" align="center"></h3>
  </div>
  `;
}
const exportForm = `<h2>Export</h2>
<form id= "ExportForm">
  ${_row(`<input type="radio" id="widget" name="exportGroup" checked>Widget<br>`)}
  ${_row(`<input type="radio" id="color" name="exportGroup" >Color<br>`)}
  <h2>Plugins</h2>
  ${showPlugins ? ` ${_row(`<input type="checkbox" id="division" name="exportGroup" >With Division<br>`)}
  ${_row(`<input type="checkbox" id="simpleCodeCheckbox" name="exportGroup" >With SimpleCode<br>`)}` : ``}
  <button id="button" type="submit">Generate</button>
  ${_row(`<span>To SVG Folder Group use: svg_SVGNAME</span>`)}
  ${_row(`<span>ex: svg_hearth</span>`)}
</form>`;

function _row(content) {
    return `<label class="row">${content}</label>`;
}

