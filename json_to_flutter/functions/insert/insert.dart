import '../../models/index.dart';
import '../checkRelationAndInsert.dart';
import '../widgetInfo.dart';

insert(No node, Widget widget, type) {
  No newNo;
  if (node.widget.runtimeType == type ||
      (node.father != null && node.father.widget.runtimeType == type)) {
    var index = 0;
    No no;
    if (node.widget.runtimeType == type) {
      no = node;
    } else {
      no = node.father;
    }
    if (type != Stack) {
      index = _insertAt(no, widget, type);
    }
    newNo = new No(no, widget, []);
    no.children.insert(index, newNo);
    attWidgetInfo(no);
  } else {
    No wNo = new No(null, widget, []);
    if (type == Row) {
      newNo = new No(null, new Row(0, 0, 0, 0, 0, 0), []);
    } else if (type == Stack) {
      newNo = new No(null, new Stack(0, 0, 0, 0, 0, 0), []);
    } else {
      newNo = new No(null, new Column(0, 0, 0, 0, 0, 0), []);
    }
    if (node.father != null) {
      newNo.father = node.father;
      node.father.children.remove(node);
      wNo.father = newNo;
      node.father = newNo;
      newNo.children.insert(0, node);
      var index = _insertAt(newNo, wNo.widget, newNo.widget.runtimeType);
      index = type == Stack ? 0 : index;
      newNo.children.insert(index, wNo);
      attWidgetInfo(newNo);
      newNo.father.children.insert(
          _insertAt(
              newNo.father, newNo.widget, newNo.father.widget.runtimeType),
          newNo);
      attWidgetInfo(newNo);
    } else {
      wNo.father = newNo;
      node.father = newNo;
      treeHead = newNo;
      newNo.children.insert(_insertAt(newNo, node.widget, type), node);
      if (type != Stack) {
        newNo.children.insert(_insertAt(newNo, wNo.widget, type), wNo);
      } else {
        newNo.children.insert(0, wNo);
      }
      attWidgetInfo(newNo);
    }
  }
}

int _insertAt(No node, Widget widget, tipo) {
  var at = node.children.length;
  for (var i = 0; i < node.children.length; i++) {
    var a =
        tipo == Column ? node.children[i].widget.y : node.children[i].widget.x;
    var b = tipo == Column ? widget.y : widget.x;
    if (b < a) {
      at = i;
      break;
    }
  }
  return at;
}
