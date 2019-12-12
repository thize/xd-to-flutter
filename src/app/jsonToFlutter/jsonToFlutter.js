const { jsonToWidgets } = require("./functions/jsonToWidgets");
const { checkRelation } = require("./functions/checkRelation");
const { logTree } = require("./functions/debug");
const { updateWidgetsSize } = require("./functions/updateWidgetsSize");

let withSimpleCode = false;
let withDivision = false;

const Relation = {
  INSIDE: 'inside',
  OUTSIDE: 'outside',
  STACK: 'stack',
}

class Tree {
  constructor() {
    this.no;
  }
}

let tree = new Tree();

async function jsonToFlutter(json, wSimpleCode, wDivision) {
  withSimpleCode = wSimpleCode;
  withDivision = wDivision;
  exports.withDivision = withDivision;
  exports.withSimpleCode = withSimpleCode;
  tree.no = null;
  let widgets = await jsonToWidgets(json);
  if (widgets.length > 0) {
    for (var i = 0; i < widgets.length; i++) {
      checkRelation(tree.no, widgets[i]);
      logTree(tree.no, 0);
    }
    let code = tree.no.widget.generateWidget(tree.no);
    //logCode(code);*/
    return code;
  } else {
    console.log("Without Widget");
    return "";
  }
}

exports.tree = tree;
exports.Relation = Relation;

module.exports = { jsonToFlutter };