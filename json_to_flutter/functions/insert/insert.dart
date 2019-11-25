import '../../models/index.dart';
import '../checkRelationAndInsert.dart';
import '../widgetInfo.dart';

insertWidgetAtNoWithType(Widget widget, No no, type) {
  No newNo;
  print("widget = ${no.widget}, run type = ${no.widget.runtimeType}");
  if (no.widget.runtimeType == type ||
      (no.father != null && no.father.widget.runtimeType == type)) {
    newNo = _insertIntoExisting(no, widget, type);
  } else {
    newNo = _createNoByType(type);
    No widgetNo = new No(null, widget, []);
    if (no.father != null) {
      _newNoAtMiddleOfTree(widgetNo, no, type, newNo);
    } else {
      _newNoAtRootOfTree(widgetNo, no, type, newNo);
    }
  }
  attWidgetInfo(newNo);
}

void _newNoAtMiddleOfTree(No widgetNo, No no, type, No newNo) {
  newNo.father = no.father;
  no.father.children.remove(no);
  widgetNo.father = newNo;
  no.father = newNo;
  newNo.children.insert(0, no);
  var index = type == Stack
      ? 0
      : _insertAt(newNo, widgetNo.widget, newNo.widget.runtimeType);
  newNo.children.insert(index, widgetNo);
  attWidgetInfo(newNo);
  newNo.father.children.insert(
      _insertAt(newNo.father, newNo.widget, newNo.father.widget.runtimeType),
      newNo);
}

void _newNoAtRootOfTree(No widgetNo, No no, type, No newNo) {
  widgetNo.father = newNo;
  no.father = newNo;
  treeHead = newNo;
  newNo.children.insert(_insertAt(newNo, no.widget, type), no);
  if (type != Stack) {
    newNo.children.insert(_insertAt(newNo, widgetNo.widget, type), widgetNo);
  } else {
    newNo.children.insert(0, widgetNo);
  }
}

No _createNoByType(type) {
  switch (type) {
    case Row:
      return new No(null, new Row(0, 0, 0, 0, 0, 0), []);
    case Stack:
      return new No(null, new Stack(0, 0, 0, 0, 0, 0), []);
    default:
      return new No(null, new Column(0, 0, 0, 0, 0, 0), []);
  }
}

No _insertIntoExisting(No no, Widget widget, type) {
  No newNo;
  No auxNo = no.widget.runtimeType == type ? no : no.father;
  var index = 0;
  if (type != Stack) {
    index = _insertAt(auxNo, widget, type);
  }
  newNo = new No(auxNo, widget, []);
  auxNo.children.insert(index, newNo);
  return auxNo;
}

int _insertAt(No no, Widget widget, type) {
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
