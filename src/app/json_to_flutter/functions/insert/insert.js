const { Row } = require("../../models/row");
const { Stack } = require("../../models/stack");
const { Column } = require("../../models/column");
const { No } = require("../../models/no");
const { attWidgetInfo } = require("../widgetInfo");
var tree = require("../main");

function insertWidgetAtNoWithType(widget, no, type) {
  let newNo;
  if (no.widget.type == type ||
    (no.father != null && no.father.widget.type == type)) {

    newNo = _insertIntoExisting(no, widget, type);
  } else {
    newNo = _createNoByType(type);
    let widgetNo = new No(null, widget, []);
    if (no.father != null) {
      _newNoAtMiddleOfTree(widgetNo, no, type, newNo);
    } else {

      _newNoAtRootOfTree(widgetNo, no, type, newNo);
    }
  }
  attWidgetInfo(newNo);
}

function _newNoAtMiddleOfTree(widgetNo, no, type, newNo) {
  newNo.father = no.father;
  var index = no.father.children.indexOf(no);
  no.father.children.splice(index, 1);
  widgetNo.father = newNo;
  no.father = newNo;
  newNo.children.splice(0, 0, no);
  var index = type == Stack
    ? 0
    : _insertAt(newNo, widgetNo.widget, newNo.widget.type);
  newNo.children.splice(index, 0, widgetNo);
  attWidgetInfo(newNo);
  newNo.father.children.splice(
    _insertAt(newNo.father, newNo.widget, newNo.father.widget.type), 0,
    newNo);
}


function _newNoAtRootOfTree(widgetNo, no, type, newNo) {
  widgetNo.father = newNo;
  no.father = newNo;
  tree.tree.no = newNo;
  newNo.children.splice(_insertAt(newNo, no.widget, type), 0, no);
  if (type != Stack) {
    newNo.children.splice(_insertAt(newNo, widgetNo.widget, type), 0, widgetNo);
  } else {
    newNo.children.splice(0, 0, widgetNo);
  }
}

function _createNoByType(type) {
  switch (type) {
    case Row:
      return new No(null, new Row(0, 0, 0, 0, 0, 0), []);
    case Stack:
      return new No(null, new Stack(0, 0, 0, 0, 0, 0), []);
    default:
      return new No(null, new Column(0, 0, 0, 0, 0, 0), []);
  }
}

function _insertIntoExisting(no, widget, type) {
  let newNo;
  let auxNo = no.widget.type == type ? no : no.father;
  var index = 0;
  if (type != Stack) {
    index = _insertAt(auxNo, widget, type);
  }
  newNo = new No(auxNo, widget, []);
  auxNo.children.splice(index, 0, newNo);
  return auxNo;
}

function _insertAt(no, widget, type) {
  var bestPosition = no.children.length;
  for (var i = 0; i < no.children.length; i++) {
    var nodeValue =
      type == Column ? no.children[i].widget.y : no.children[i].widget.x;
    var widgetValue = type == Column ? widget.y : widget.x;
    if (widgetValue < nodeValue) {
      bestPosition = i;
      break;
    }
  }
  return bestPosition;
}


module.exports = { insertWidgetAtNoWithType };