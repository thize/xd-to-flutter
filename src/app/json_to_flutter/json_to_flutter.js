const { json_to_widgets } = require("./functions/json_to_widgets");
const { checkRelationAndInsert } = require("./functions/checkRelationAndInsert");
const { logTree } = require("./functions/debug");
const { update_widgets_size } = require("./functions/update_widgets_size");

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

async function json_to_flutter(json, wSimpleCode, wDivision) {
  withSimpleCode = wSimpleCode;
  withDivision = wDivision;
  exports.withDivision = withDivision;
  exports.withSimpleCode = withSimpleCode;
  tree.no = null;
  let widgets = await json_to_widgets(json);
  if (widgets.length > 0) {
    for (var i = 0; i < widgets.length; i++)
      checkRelationAndInsert(tree.no, widgets[i]);
    update_widgets_size(tree.no, tree.no);
    let code = tree.no.widget.generateWidget(tree.no);
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

module.exports = { json_to_flutter };