const { showMessageWithColor } = require("./src/showMessage");
const { generateColor } = require("./src/color");
const { allToWidget } = require("./src/allToWidget");

let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
let panel;

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
                    generatedWidget = await allToWidget(selection, simpleCode, division);
                    if (method) {
                        generatedWidget = `${methodName}() {
                        return ${generatedWidget};
                        }`;
                    }
                    clipboard.copyText(generatedWidget);
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
                console.log(`qtd = ${selection.items[0].children.length}`);

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
    panel.querySelector("#methodCheckbox").addEventListener("click", function () {
        update();
    });
    panel.querySelector("#simpleCodeCheckbox").addEventListener("click", function () {
        update();
    });
    panel.querySelector("#division").addEventListener("click", function () {
        update();
    });
    return panel;
}

function update() {
    const selection = scenegraph.selection;
    const method = document.querySelector("#methodCheckbox").checked;
    const input = document.querySelector("#methodInput");
    const buttons = document.querySelectorAll("button");
    if (method) {
        input.removeAttribute("disabled");
    } else {
        input.value = "";
        input.setAttribute("disabled", "disabled");
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
    return `
  <style>.hidden {opacity: 0.0;} .center {text-align: center;display: flex;justify-content: center;}</style>
  ${exportForm}
  <div class="center">
    <h2 id="message" style="color:green;" align="center"></h3>
  </div>
  `;
}

module.exports = {
    panels: {
        createWidgets: {
            show,
            update
        }
    },
};

let exportForm = `
  <h2>Export</h2>
  <form id= "ExportForm">
    <fieldset id="exportGroup">
      <label class="row">
        <input type="radio" id="widget" name="exportGroup" checked>Widget<br>
      </label>
      <label class="row">
        <input type="radio" id="color" name="exportGroup" >Color<br>
      </label>
      <label class="row">
        <input type="checkbox" id="methodCheckbox" name="exportGroup" >Extract with method<br>
      </label>
      <label class="row">
          <span>Method Name</span>
          <input id="methodInput" type="text" placeholder="Name"/>
      </label>
    </fieldset>
    <button id="button" type="submit">Generate</button>
    <label class="row">
        <input type="checkbox" id="simpleCodeCheckbox" name="exportGroup" >With SimpleCode<br>
    </label>
    <label class="row">
        <input type="checkbox" id="division" name="exportGroup" >With Division<br>
    </label>
  </form>
  `;


