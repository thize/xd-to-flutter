import '../models/index.dart';
import '../functions/util.dart';

abstract class Widget {
  double x, y, w, h, gw, gh;
  String id;
  Widget(this.x, this.y, this.w, this.h, this.gw, this.gh, this.id) {
    x = fixDouble(x);
    y = fixDouble(y);
    w = fixDouble(w);
    h = fixDouble(h);
    gw = fixDouble(gw);
    gh = fixDouble(gh);
  }

  String generateWidget(No node);
}
