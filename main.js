let clipboard = require("clipboard");
let scenegraph = require("scenegraph");
let panel;
const { error, alert } = require("./dialogs/dialogs");

function create() {
  panel = document.createElement("div");
  panel.innerHTML = generateHtml();
  panel.querySelector("#ExportForm").addEventListener("submit", function () {
    const selection = scenegraph.selection;
    if (selection.items.length != 0) {
      onTapExport(selection);
    } else {
      error("Error", "Select something");
    }
  });
  panel.querySelector("#MarginForm").addEventListener("submit", function () {
    const selection = scenegraph.selection;
    if (selection.items.length == 2) {
      onTapMargin(selection);
    } else {
      error("Error", "Select 2 Components");
    }
  });
  panel.querySelector("#methodCheckbox").addEventListener("click", function () {
    update();
  });
  return panel;
}

function onTapExport() {
  const widget = document.querySelector("#widget").checked;
  const color = document.querySelector("#color").checked;
  const textStyle = document.querySelector("#textStyle").checked;
  const method = document.querySelector("#methodCheckbox").checked;
  const methodName = document.querySelector("#methodInput").value;
  if (method && methodName == "") {
    error("Error", "Method name cannot be empty");
  } else {
    try {
      if (widget) {
        console.log("widget" + `, method = ${method}`);
      } else if (color) {
        alert("Ops", "Color not implemented yet");
      } else if (textStyle) {
        alert("Ops", "TextStyle not implemented yet");
      }
      sucessGenereateWidget();
    } catch (error) {
      console.log("error ao gerar widget");
    }
  }
}

function onTapMargin() {
  try {
    console.log("onTapMargin");
    sucessGenereateWidget();
  } catch (error) {
    console.log("error ao gerar widget");
  }
}

async function sucessGenereateWidget() {
  console.log("sucessGenereateWidget");
  const sucess = document.querySelector("#sucess");
  sucess.innerHTML = "Successfully generated!\nWidget copied to clipboard.";
  setTimeout(function () { sucess.innerHTML = ""; }, 1500);
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
    <h2 id="sucess" style="color:green;" align="center"></h3>
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
