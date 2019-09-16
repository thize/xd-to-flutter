let clipboard = require("clipboard");
const { error, alert } = require("./dialogs/dialogs");
const { generateWidget } = require("./functions");

function createCodeFunction(selection) {
  if (selection.items.length != 0) {
    let widget = "";
    selection.items.forEach((item, pos) => {
      if (pos == selection.items.length - 1 || selection.items.length == 1) {
        widget += generateWidget(item);
      } else {
        widget += `${generateWidget(item)},`;
      }
    });
    clipboard.copyText(widget);
    alert("Code generate with sucess", "Code copied to clipboard");
  } else {
    error("Error", "Select something");
  }
}

module.exports = {
  commands: {
    createCode: createCodeFunction
  },
};