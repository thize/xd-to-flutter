import 'index.dart';

class Stack extends Widget {
  Stack(double x, double y, double w, double h, double gw, double gh,
      {String id = "-1"})
      : super(x, y, w, h, gw, gh, id);

  @override
  String generateWidget(No node) {
    List<String> widgets = [];
    node.children?.forEach((f) {
      widgets.add("${f.widget.generateWidget(f)}");
    });
    widgets = widgets.reversed.toList();
    String wid = "$widgets";
    return "Stack(children:<Widget>$wid,)";
  }
}
