const { onTapGenerateColor } = require("./src/generateColor");
const { onTapGenerateWidget } = require("./src/generateWidget/generateWidget");
const { onTapGenerateGlobal } = require("./src/generateGlobal");

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
        exportVariables();
        onTapGenerateWidget();
    });

    panel.querySelector("#ExportColor").addEventListener("submit", function () {
        const selection = scenegraph.selection;
        const type = document.querySelector("#fill").checked ? 'fill' : document.querySelector("#border").checked ? 'border' : 'shadow';
        exportVariables();
        onTapGenerateColor(selection, type);
    });

    panel.querySelector("#ExportGlobal").addEventListener("submit", function () {
        const type = document.querySelector("#colors").checked ? 'Colors' : document.querySelector("#textStyles").checked ? 'Text Styles' : 'Components';
        exportVariables();
        onTapGenerateGlobal(type);
    });
    return panel;
}

function exportVariables() {
    const withSimpleCode = document.querySelector("#simpleCodeCheckbox").checked;
    const withDivision = document.querySelector("#division").checked;
    exports.withSimpleCode = withSimpleCode;
    exports.withDivision = withDivision;
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
        } else if (button.id == "buttonColor") {
            if (selection.items.length == 1 && selection.items[0].children.length == 0) {
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
    ${util}
    ${spacer}
    ${widget}    
    ${spacer}
    ${color}  
    ${spacer}
    ${global}  
  `;
}

const spacer = `<h2></h2><h2></h2><h2></h2>`;

const color = `
<h2>Color</h2>
<form id= "ExportColor">
    ${_row(`<input type="radio" id="fill" name="color" checked>Fill<br>`)}
    ${_row(`<input type="radio" id="border" name="color" >Border<br>`)}
    ${_row(`<input type="radio" id="shadow" name="color" >Shadow<br>`)}
    ${_row(`<h2 id="messageColor" style="color:green;" align="center"></h2>`)}
    ${_row(`<button id="buttonColor" type="submit">Export color</button>`)}
</form>
`;

const global = `
<h2>Global</h2>
<form id= "ExportGlobal">
    ${_row(`<input type="radio" id="colors" name="global" checked>Colors<br>`)}    
    ${_row(`<input type="radio" id="textStyles" name="global" >Text Styles<br>`)}    
    ${_row(`<input type="radio" id="components" name="global" >Components<br>`)}    
    ${_row(`<h2 id="messageGlobal" style="color:green;" align="center"></h2>`)}
    ${_row(`<button id="buttonGlobal" type="submit" uxp-variant="cta">Export global</button>`)}  
</form>
`;

const util = `
<h2>Util</h2>
${_row(`<input type="checkbox" id="simpleCodeCheckbox" name="exportGroup" >with SimpleCode<br>`)}
${ _row(`<input type="checkbox" id="division" name="exportGroup" >with Division<br>`)}
`;

const widget = `
<h2>Widget</h2>
<form id= "ExportForm">
${_row(`<input type="radio" id="widget" name="exportGroup" checked>Widget<br>`)}
${_row(`<h2 id="messageWidget" style="color:green;" align="center"></h2>`)}
${_row(`<button id="button" type="submit">Generate </button>`)}
${_row(`<span>To SVG Folder Group use: svg_SVGNAME</span>`)}
${_row(`<span font-size="6" >ex: svg_hearth</span>`)}
</form>
`;

function _row(content) {
    return `<label class="row">${content}</label>`;
}


