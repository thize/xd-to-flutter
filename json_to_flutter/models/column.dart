import 'index.dart';

class Column extends Widget {
  Column(double x, double y, double w, double h, double gw, double gh,
      {String id = "-1"})
      : super(x, y, w, h, gw, gh, id);

  @override
  String generateWidget(No no) {
    List<String> widgets = [];
    no.children?.forEach((f) {
      widgets.add("${f.widget.generateWidget(f)}");
    });
    String wid = "$widgets";
    return "Column(children:<Widget>$wid,)";
  }
}
