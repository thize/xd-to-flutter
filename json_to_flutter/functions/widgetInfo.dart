import 'dart:math';
import '../models/index.dart';

No attWidgetInfo(No no) {
  if (no.widget.id == "-1") {
    Container newInfo = _newWidgetInfo(no.children);
    no.widget.x = newInfo.x;
    no.widget.y = newInfo.y;
    no.widget.gw = newInfo.gw;
    no.widget.gh = newInfo.gh;
  }
  if (no.father != null) {
    attWidgetInfo(no.father);
  }
  return no;
}

Widget _newWidgetInfo(List<No> nos) {
  double x = -1, y = -1, w = -1, h = -1;
  nos.forEach((f) {
    if (x == -1) {
      x = f.widget.x;
      y = f.widget.y;
      w = x + f.widget.gw;
      h = y + f.widget.gh;
    } else {
      x = min(x, f.widget.x);
      y = min(y, f.widget.y);
      w = max(w, f.widget.x + f.widget.gw);
      h = max(h, f.widget.y + f.widget.gh);
    }
  });
  return new Container(x, y, 0, 0, w - x, h - y);
}
