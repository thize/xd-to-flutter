import '../main.dart';

double fixDouble(dynamic value) {
  try {
    return double.parse(value.toStringAsFixed(2));
  } catch (e) {
    return double.parse((value.toDouble()).toStringAsFixed(2));
  }
}

String sz(double value) {
  if (withSimpleCode) {
    return "sz($value)";
  }
  return "$value";
}

hexColorToFlutterColor(String hexColor, double opacity,
    {bool transparent = false, bool withTag = true}) {
  String color;
  if (opacity == 0) {
    if (transparent)
      color = "";
    else
      color = "color: Colors.transparent,";
  } else
    color = _hexToMaterialColor("Color(${hexColor.replaceAll("#", "0xff")})");
  if (!withTag) return "$color";
  return "color: $color" + (withDivision ? "" : ",");
}

String _hexToMaterialColor(String color) {
  return color;
}

String widthHeight(value, {bool width, bool division = false}) {
  String type = "height";
  if (value != 0) {
    if (width) type = "width";
    if (division) return "..$type(${sz(value)})";
    return "$type: ${sz(value)},";
  }
  return "";
}

String rotate(double rotation, {String child}) {
  if (rotation > 0) {
    if (withDivision) return "..rotate(${rotation / 360})";
    return """
      Transform.rotate(
        angle: $rotation * pi /
        child: ${child},
      )
      """;
  }
  return child ?? "";
}

/*

*/
