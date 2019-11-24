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

Relation checkIfIsInside(Widget ant, Widget widget) {
  var x = ant.x, y = ant.y, w = ant.gw, h = ant.gh;
  var ix = widget.x, iy = widget.y, iw = widget.gw, ih = widget.gh;
  var iaf = iy + ih;
  var ilf = ix + iw;
  var af = y + h;
  var lf = x + w;
  if (iy >= y - 0.3 && iaf <= af + 0.3 && ix >= x - 0.3 && ilf <= lf + 0.3) {
    return Relation.inside;
  } else if (ilf <= x || lf <= ix || iaf <= y || af <= iy) {
    return Relation.outside;
  } else {
    return Relation.stack;
  }
}
