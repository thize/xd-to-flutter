const { jsonToWidgetList } = require("./jsonToWidgetList");
const { checkRelationAndInsert } = require("./checkRelationAndInsert");
const { logTree } = require("./debug");

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

async function generateWidgetFromJson(json, wSimpleCode, wDivision) {
  withSimpleCode = wSimpleCode;
  withDivision = wDivision;
  exports.withDivision = withDivision;
  exports.withSimpleCode = withSimpleCode;
  tree.no = null;
  // Generate widgets from Json
  let widgets = await jsonToWidgetList(json);
  if (widgets.length > 0) {
    // Generate Tree
    for (var i = 0; i < widgets.length; i++)
      checkRelationAndInsert(tree.no, widgets[i]);
    // Generate code
    let code = tree.no.widget.generateWidget(tree.no);
    // Logs
    logTree(tree.no, 0);
    //logCode(code);
    return code;
  } else {
    console.log("Without Widget");
    return "";
  }
}
exports.tree = tree;
exports.Relation = Relation;
module.exports = { generateWidgetFromJson };