const { showMessageWithColor } = require("./src/showMessage");
const { generateColor } = require("./src/color");
const { allToWidget } = require("./src/allToWidget");
let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
let panel;
let showAutomaticButton = false;
let showPlugins = true;

function onTapGenerate(selection) {
    const widget = document.querySelector("#widget").checked;
    const color = document.querySelector("#color").checked;
    const method = document.querySelector("#methodCheckbox").checked;
    const simpleCode = document.querySelector("#simpleCodeCheckbox").checked;
    const division = document.querySelector("#division").checked;
    const methodName = document.querySelector("#methodInput").value;
    let generatedWidget = "";
    if (method && methodName == "") {
        showMessageWithColor("Method name cannot be empty", "red");
    } else {
        try {
            if (widget) {
                require("application").editDocument(async () => {
                    try {
                        generatedWidget = await allToWidget(selection, simpleCode, division);
                        if (method) {
                            generatedWidget = `${methodName}() {
                        return ${generatedWidget};
                        }`;
                        }
                        clipboard.copyText(generatedWidget);
                    } catch (error) {
                        showMessageWithColor(error.toString().includes('TypeError') ? "Error" : error, "red");
                    }
                });
            } else if (selection.items.length == 1 && selection.items[0].children.length < 2) {
                if (color) {
                    generatedWidget = generateColor(selection.items[0]);
                }
                if (method) {
                    generatedWidget = `${methodName}() {
                    return ${generatedWidget};
                    }`;
                }
                clipboard.copyText(generatedWidget);
            } else {
                throw "Select only one widget";
            }
            showMessageWithColor("Successfully generated", "green");
        } catch (error) {
            showMessageWithColor(error.toString().includes('TypeError') ? "Error" : error, "red");
        }
    }
}

function create() {
    panel = document.createElement("div");
    panel.innerHTML = generateHtml();
    panel.querySelector("#ExportForm").addEventListener("submit", function () {
        const selection = scenegraph.selection;
        if (selection.items.length != 0) {
            onTapGenerate(selection);
        } else {
            showMessageWithColor("Select something", "grey");
        }
    });
    panel.querySelector("#methodCheckbox").addEventListener("click", update);
    return panel;
}

function update() {
    const selection = scenegraph.selection;
    const method = document.querySelector("#methodCheckbox").checked;
    const methodInput = document.querySelector("#methodInput");
    const rippleCheckbox = document.querySelector("#rippleCheckbox");
    const automaticDetectButton = document.querySelector("#automaticDetectButton").checked;
    const buttons = document.querySelectorAll("button");
    if (automaticDetectButton) {
        rippleCheckbox.removeAttribute("disabled");
    } else {
        rippleCheckbox.setAttribute("disabled", "disabled");
    }
    if (method) {
        methodInput.removeAttribute("disabled");
    } else {
        methodInput.value = "";
        methodInput.setAttribute("disabled", "disabled");
    }
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
    updateExport();
    return `
  <style>.hidden {opacity: 0.0;} .center {text-align: center;display: flex;justify-content: center;}</style>
  ${exportForm}
  <div class="center">
    <h2 id="message" style="color:green;" align="center"></h3>
  </div>
  `;
}
function updateExport() {
    exportForm = `
    <h2>Export</h2>
    <form id= "ExportForm">
      ${_row(`<input type="radio" id="widget" name="exportGroup" checked>Widget<br>`)}
      ${_row(`<input type="radio" id="color" name="exportGroup" >Color<br>`)}
      ${_row(`<input type="checkbox" id="methodCheckbox" name="exportGroup" >Extract with method<br>`)}
      ${_row(`<span>Method Name</span>`)}
      ${_row(`<input id="methodInput" type="text" placeholder="Name"/>`)}    
      ${showAutomaticButton ? ` <h2>Button</h2>
      ${_row(`<input type="checkbox" id="automaticDetectButton" name="exportGroup" >Automatic Detect<br>`)}
      ${_row(`<input type="checkbox" id="rippleCheckbox" name="exportGroup" >With Ripple<br>`)} ` : ''}   
      <h2>Plugins</h2>
      ${showPlugins ? ` ${_row(`<input type="checkbox" id="division" name="exportGroup" >With Division<br>`)}
      ${_row(`<input type="checkbox" id="simpleCodeCheckbox" name="exportGroup" >With SimpleCode<br>`)}` : ``}
      <button id="button" type="submit">Generate</button>
      ${_row(`<span>To SVG Folder Group use: svg_SVGNAME</span>`)}
      ${_row(`<span>ex: svg_hearth</span>`)}
    </form>
    `;
}
let exportForm;
function _row(content) {
    return `<label class="row">${content}</label>`;
}

module.exports = {
    panels: {
        createWidgets: {
            show,
            update
        }
    },
};