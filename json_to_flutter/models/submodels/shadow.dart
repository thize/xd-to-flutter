import '../../functions/util.dart';
import '../../main.dart';

class Shadow {
  double x;
  double y;
  String color;
  double opacity;
  bool visible;
  double blurRadius;

  Shadow(
      {this.x,
      this.y,
      this.color,
      this.opacity,
      this.visible,
      this.blurRadius});

  Shadow.fromJson(Map<String, dynamic> json, bool withColor) {
    visible = json['visible'] && withColor;
    if (visible) {
      x = fixDouble(json['x']);
      y = fixDouble(json['y']);
      opacity = fixDouble(json['opacity']);
      color = hexColorToFlutterColor(json['color'], opacity);
      blurRadius = fixDouble(json['blur']);
    }
  }
  String print({bool isText = false}) {
    if (visible) {
      String offSet = "offset: Offset(${sz(x)},${sz(y)})";
      String blurR = "${sz(blurRadius)}";
      if (withDivision)
        return """
        ..boxShadow(${color}, blur: $blurR, $offSet)
        """;
      return """
      ${isText ? "shadows" : "boxShadow"}: [
        BoxShadow(
           $offSet,${color}blurRadius: $blurR,
        ),
      ], 
      """;
    }
    return "";
  }
}
