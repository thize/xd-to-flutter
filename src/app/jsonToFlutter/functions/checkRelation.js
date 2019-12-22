const { No } = require("../models/no");
const { insertInside } = require("./insert/insert_in");
const { insertOutside } = require("./insert/insert_out");
const { insertStack } = require("./insert/insert_stack");
var tree = require("../jsonToFlutter");
var Relation = require("../jsonToFlutter");


function checkRelation(father, widget) {
  if (father != null) {
    // Id -1 is Genereated Widget (Column, Row or Stack)
    let type = father.widget.id == -1 ? Relation.Relation.INSIDE : checkIfIsInside(father.widget, widget);
    switch (type) {
      case Relation.Relation.INSIDE:
        insertInside(father, widget);
        break;
      case Relation.Relation.OUTSIDE:
        insertOutside(father, widget);
        break;
      default:
        insertStack(father, widget);
        break;
    }
  } else {
    // Creating first no of tree
    tree.tree.no = new No(null, widget, []);
  }
}

function checkIfIsInside(ant, widget, onlyW, onlyH) {
  onlyW = onlyW == null ? false : onlyW;
  onlyH = onlyH == null ? false : onlyH;
  var father_x = ant.x; var father_y = ant.y; var father_w = ant.w; var father_h = ant.h;
  var widget_x = widget.x; var widget_y = widget.y; var widget_w = widget.w; var widget_h = widget.h;
  var widget_final_h = widget_y + widget_h;
  var widget_final_w = widget_x + widget_w;
  var father_final_h = father_y + father_h;
  var father_final_w = father_x + father_w;
  if (_checkOnly(onlyW, widget_y, father_y, widget_final_h, father_final_h) &&
    _checkOnly(onlyH, widget_x, father_x, widget_final_w, father_final_w)) {
    return Relation.Relation.INSIDE;
  } else if (widget_final_w <= father_x ||
    father_final_w <= widget_x ||
    widget_final_h <= father_y ||
    father_final_h <= widget_y) {
    return Relation.Relation.OUTSIDE;
  } else {
    return Relation.Relation.STACK;
  }
}

function _checkOnly(ignore, widget, father, widget_final, father_final) {
  if (ignore) return true;
  return widget >= father - 0.3 && widget_final <= father_final + 0.3;
}

exports.checkIfIsInside = checkIfIsInside;
exports.checkRelation = checkRelation;
module.exports = { checkRelation, checkIfIsInside, Relation, tree };
