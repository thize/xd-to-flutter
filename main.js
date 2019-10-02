const { generateWidget, generateColor, generateTextStyle } = require("./src/generate");
const { showMessageWithColor } = require("./src/showMessage");
let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
let panel;

function onTapGenerate(selection) {
  const widget = document.querySelector("#widget").checked;
  const color = document.querySelector("#color").checked;
  const textStyle = document.querySelector("#textStyle").checked;
  const method = document.querySelector("#methodCheckbox").checked;
  const methodName = document.querySelector("#methodInput").value;
  const name = selection.items[0].constructor.name;
  let generatedWidget = "";
  if (method && methodName == "") {
    showMessageWithColor("Method name cannot be empty", "red");
  } else if (selection.items.length != 1) {
    showMessageWithColor("Multi items not implemented yet", "grey");
  } else if (name == "Group" || name == "Artboard") {
    showMessageWithColor(`${name} not implemented yet`, "grey");
  } else {
    try {
      if (widget) {
        generatedWidget = generateWidget(selection.items[0]);
      } else if (color) {
        generatedWidget = generateColor(selection.items[0]);
      } else if (textStyle) {
        if (name == "Text") {
          generatedWidget = generateTextStyle(selection.items[0]);
        } else {
          throw "Select an text";
        }
      }
      if (method) {
        generatedWidget = `${methodName}() {
          return ${generatedWidget};
        }`;
      }
      clipboard.copyText(removeSz(generatedWidget));
      showMessageWithColor("Successfully generated", "green");
    } catch (error) {
      showMessageWithColor(error.toString().includes('TypeError') ? "Error" : error, "red");
    }
  }
}

function removeSz(generatedWidget) {
  if (generatedWidget.includes("sz(")) {
    let initPos = generatedWidget.indexOf("sz(");
    let finalPos = generatedWidget.indexOf(")", initPos);
    let value = generatedWidget.substring(initPos + 3, finalPos);
    generatedWidget = generatedWidget.substring(0, initPos) + value + generatedWidget.substring(finalPos + 1, generatedWidget.length);
    return removeSz(generatedWidget);
  }
  return generatedWidget;
}

function onTapGenerateMargin() {
  showMessageWithColor("Margin not implemented yet", "grey");
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
  panel.querySelector("#MarginForm").addEventListener("submit", function () {
    const selection = scenegraph.selection;
    if (selection.items.length == 2) {
      onTapGenerateMargin(selection);
    } else {
      showMessageWithColor("Select 2 Components", "grey");
    }
  });
  panel.querySelector("#methodCheckbox").addEventListener("click", function () {
    update();
  });
  return panel;
}

function update() {
  const selection = scenegraph.selection;
  const method = document.querySelector("#methodCheckbox").checked;
  const input = document.querySelector("#methodInput");
  const marginButton = document.querySelector("#marginButton");
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
  if (selection.items.length != 2) {
    marginButton.setAttribute("uxp-variant", "");
  }
}

function show(event) {
  if (!panel) event.node.appendChild(create());
}

function generateHtml() {
  return `
  <style>.hidden {opacity: 0.0;} .center {text-align: center;display: flex;justify-content: center;}</style>
  ${exportForm}
  ${marginForm}
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
        <input type="radio" id="textStyle" name="exportGroup" >TextStyle<br>
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
  </form>
  `;

let marginForm = `
  <form id= "MarginForm">
  </form>
`;

/*
let marginForm = `
  <h2>Margin</h2>
  <form id= "MarginForm">
    <fieldset id="marginGroup">
      <label class="row">
        <input type="radio" id="Spacer" name="marginGroup" checked>Spacer<br>
      </label>
      <label class="row">
        <input type="radio" id="SizedBox" name="marginGroup" >SizedBox<br>
      </label>
    </fieldset>
    <button id="marginButton" type="submit">Generate margin</button>
  </form>
`;
*/