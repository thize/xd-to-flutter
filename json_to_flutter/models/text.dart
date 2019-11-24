import 'index.dart';
import 'submodels/shadow.dart';
import '../functions/util.dart';

class Text extends Widget {
  double rotation;
  String type;
  String text;
  bool withAreaBox;
  bool withColor;
  String color;
  String textAlign;
  bool underline;
  bool strikethrough;
  String fontFamily;
  String fontWeight;
  double fontSize;
  double opacity;
  Shadow shadow;
  Text(double x, double y, double w, double h, double gw, double gh,
      {String id = "-1"})
      : super(x, y, w, h, gw, gh, id);

  @override
  String generateWidget(No no) {
    return """
    Text(
      "$text",
      overflow: TextOverflow.ellipsis,
      style: TextStyle(
        fontFamily: "$fontFamily",
        fontSize: ${sz(fontSize)},
        ${_fontWeight()}
        $color
        ${_decoration()}
      ),
    )
    """;
    //${shadow.print(isText: true)}
  }

  Text.fromJson(Map<String, dynamic> json)
      : super(
            json["x"].toDouble(),
            json["y"].toDouble(),
            json["w"].toDouble(),
            json["h"].toDouble(),
            json["globalW"].toDouble(),
            json["globalH"].toDouble(),
            json["name"]) {
    type = json['type'];
    text = json['text'].replaceAll("\n", "\\n");
    id = text;
    withAreaBox = json['withAreaBox'];
    withColor = json['wcolor'];
    rotation = fixDouble(json['rotation']);
    opacity = fixDouble(json['opacity'].toDouble());
    color = hexColorToFlutterColor(
        json['color'].toString(), withColor ? opacity : 0);
    textAlign = json['textAlign'];
    underline = json['underline'];
    strikethrough = json['strikethrough'];
    fontFamily = json['fontFamily'];
    fontWeight = json['fontWeight'];
    fontSize = fixDouble(json['fontSize'].toDouble());
    shadow = json['shadow'] != null
        ? new Shadow.fromJson(json['shadow'], withColor)
        : null;
  }
  String _decoration() {
    if (strikethrough) {
      return "decoration: TextDecoration.underline,";
    } else if (underline) {
      return "decoration: TextDecoration.underline,";
    }
    return "";
  }

  String _fontWeight() {
    fontWeight = fontWeight.toLowerCase().replaceAll("-", "");
    if (fontWeight == "thin") {
      fontWeight = "100";
    } else if (fontWeight == "extraligth") {
      fontWeight = "200";
    } else if (fontWeight == "light") {
      fontWeight = "300";
    } else if (fontWeight == "medium") {
      fontWeight = "500";
    } else if (fontWeight == "semibold") {
      fontWeight = "600";
    } else if (fontWeight == "bold") {
      fontWeight = "700";
      return 'fontWeight: FontWeight.bold,';
    } else if (fontWeight == "extrabold") {
      fontWeight = "800";
    } else if (fontWeight == "black") {
      fontWeight = "900";
    } else {
      fontWeight = "400";
      return "";
    }
    return 'fontWeight: FontWeight.w${fontWeight},';
  }
}
