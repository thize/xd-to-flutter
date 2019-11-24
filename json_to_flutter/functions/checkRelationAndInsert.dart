import '../models/index.dart';
import 'insert/insert_in.dart';
import 'insert/insert_out.dart';
import 'insert/insert_stack.dart';

No treeHead;

enum Relation { inside, outside, stack }

checkRelationAndInsert(No father, Widget widget) {
  if (father != null) {
    Relation type = checkIfIsInside(father.widget, widget);
    // Id -1 is Genereated Widget (Column, Row or Stack)
    if (father.widget.id == "-1")
      insertInside(father, widget);
    else
      switch (type) {
        case Relation.inside:
          insertInside(father, widget);
          break;
        case Relation.outside:
          insertOutside(father, widget);
          break;
        default:
          insertStack(father, widget);
          break;
      }
  } else {
    // Creating first node of tree
    treeHead = new No(null, widget, []);
  }
}

Relation checkIfIsInside(Widget ant, Widget widget,
    {bool onlyW = false, bool onlyH = false}) {
  var father_x = ant.x, father_y = ant.y, father_w = ant.gw, father_h = ant.gh;
  var widget_x = widget.x,
      widget_y = widget.y,
      widget_w = widget.gw,
      widget_h = widget.gh;
  var widget_final_h = widget_y + widget_h;
  var widget_final_w = widget_x + widget_w;
  var father_final_h = father_y + father_h;
  var father_final_w = father_x + father_w;
  if (_checkOnly(onlyW, widget_y, father_y, widget_final_h, father_final_h) &&
      _checkOnly(onlyH, widget_x, father_x, widget_final_w, father_final_w)) {
    return Relation.inside;
  } else if (widget_final_w <= father_x ||
      father_final_w <= widget_x ||
      widget_final_h <= father_y ||
      father_final_h <= widget_y) {
    return Relation.outside;
  } else {
    return Relation.stack;
  }
}

bool _checkOnly(bool ignore, double widget, double father, double widget_final,
    double father_final) {
  if (ignore) return true;
  return widget >= father - 0.3 && widget_final <= father_final + 0.3;
}
