import 'index.dart';
import '../functions/util.dart';

class Svg extends Widget {
  double rotation;
  Svg(double x, double y, double w, double h, double gw, double gh,
      {String id = "-1"})
      : super(x, y, w, h, gw, gh, id);

  @override
  String generateWidget(No no) {
    return """
    Container(
      color: Colors.red,
      ${widthHeight(w, width: true)}
      ${widthHeight(h, width: false)}
    )
    """;
    /*return """
    SvgPicture.asset(
      "assets/$id.svg",
      ${widthHeight(w, width: true)}
      ${widthHeight(h, width: false)}
    )
    """;*/
  }

  Svg.fromJson(Map<String, dynamic> json)
      : super(
            json["x"].toDouble(),
            json["y"].toDouble(),
            json["w"].toDouble(),
            json["h"].toDouble(),
            json["globalW"].toDouble(),
            json["globalH"].toDouble(),
            json["name"]) {
    rotation = fixDouble(json['rotation']);
  }
}
