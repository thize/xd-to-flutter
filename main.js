const { run } = require("./src/run");
let scenegraph = require("scenegraph");
let panel;

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
        run();
    });
    return panel;
}


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
    if (!panel) event.node.appendChild(create());
}

function generateHtml() {
    return `
    <style>.hidden {opacity: 0.0;} .center {text-align: center;display: flex;justify-content: center;}</style>
    ${spacer}
    ${widget}    
  `;
}

const spacer = `<h2></h2><h2></h2><h2></h2>`;

const widget = `
<h2>Widget</h2>
<form id= "ExportForm">
${_row(`<input type="radio" id="widget" name="exportGroup" checked>Widget<br>`)}
${_row(`<h2 id="messageWidget" style="color:green;" align="center"></h2>`)}
${_row(`<button id="button" type="submit">Generate</button>`)}
</form>
`;

function _row(content) {
    return `<label class="row">${content}</label>`;
}


