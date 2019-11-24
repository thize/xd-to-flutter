import 'index.dart';
import '../functions/util.dart';
import 'submodels/radius.dart';
import 'submodels/shadow.dart';
import '../main.dart';

class Container extends Widget {
  bool isArtboard;
  String color;
  String name;
  Radius radius;
  double rotation;
  bool withColor;
  bool haveImage;
  String borderColor;
  double borderWidth;
  bool withBorder;
  double opacity;
  double borderOpacity;
  Shadow shadow;
  String shape;
  Container(double x, double y, double w, double h, double gw, double gh,
      {String id = "-1", this.isArtboard = false})
      : super(x, y, w, h, gw, gh, id);

  @override
  String generateWidget(No no) {
    String widget = withDivision ? divisionWidget(no) : defaultWidget(no);
    return widget;
    /*.replaceAll("\n", "")
        .replaceAll(" ", "");*/
  }

  Container.fromJson(Map<String, dynamic> json)
      : super(
            json["x"].toDouble(),
            json["y"].toDouble(),
            json["w"].toDouble(),
            json["h"].toDouble(),
            json["globalW"].toDouble(),
            json["globalH"].toDouble(),
            json["name"]) {
    opacity = fixDouble(json['opacity']);
    withColor = json['wcolor'];
    haveImage = json['image'];
    rotation = fixDouble(json['rotation']);
    color = haveImage
        ? ""
        : hexColorToFlutterColor(
            json['color'].toString(), withColor ? opacity : 0,
            transparent: true, withTag: !withDivision);
    borderOpacity = fixDouble(json['borderOpacity']);
    borderColor = hexColorToFlutterColor(
        json['borderColor'].toString(), borderOpacity,
        transparent: true);
    borderWidth = json['borderWidth'].toDouble();
    withBorder = json['withBorder'];
    shape = json['shape'];
    radius =
        json['radius'] != null ? new Radius.fromJson(json['radius']) : null;
    shadow = json['shadow'] != null
        ? new Shadow.fromJson(json['shadow'], withColor)
        : null;
  }
  String _child(No no) {
    String child = no.children.length > 0
        ? no.children[0].widget.generateWidget(no.children[0])
        : null;
    child = child != null ? "child:${child}," : "";
    return child;
  }

  String _decoration() {
    if (haveImage ||
        withBorder ||
        shape != "rectangle" ||
        shadow.visible ||
        radius != null) {
      return """decoration: BoxDecoration(
        $color
        ${_border()}
        ${_radius()}
        ${_shape()}
        ${_image()}
        ${shadow.print()}
      ),""";
    } else {
      return color;
    }
  }

  String _border() {
    if (withBorder && borderWidth != 0) {
      if (withDivision) return "..border(all: ${sz(borderWidth)},$borderColor)";
      return "border: Border.all(${widthHeight(borderWidth, width: true)}$borderColor),";
    }
    return "";
  }

  String _shape() {
    if (shape == "ellipse") {
      if (withDivision) return "..borderRadius(all:${w})";
      return "borderRadius: BorderRadius.all(Radius.elliptical($gw, $gh)),";
    } else if (shape == "circle") {
      if (withDivision) return "..borderRadius(all:${w})";
      return "shape: BoxShape.circle,";
    }
    return "";
  }

  String _image() {
    if (haveImage) {
      return """
      image: DecorationImage(
        image: AssetImage("assets/$id.png"),
      ),
      """;
    }
    return "";
  }

  String _radius() {
    if (radius != null) {
      if (radius.isCircular()) {
        if (withDivision) return "..borderRadius(all:${sz(radius.topLeft)})";
        return "borderRadius: BorderRadius.circular(${sz(radius.topLeft)}),";
      }
      var tL = radius.topLeft != 0
          ? "topLeft: ${radiusCircular(sz(radius.topLeft))},"
          : "";
      var tR = radius.topRight != 0
          ? "topRight: ${radiusCircular(sz(radius.topRight))},"
          : "";
      var bL = radius.bottomLeft != 0
          ? "bottomLeft: ${radiusCircular(sz(radius.bottomLeft))},"
          : "";
      var bR = radius.bottomRight != 0
          ? "bottomRight: ${radiusCircular(sz(radius.bottomRight))}"
          : "";
      if (withDivision) return "..borderRadius($tL$tR$bL$bR)";
      return "borderRadius: BorderRadius.only($tL$tR$bL$bR),";
    }
    return "";
  }

  divisionWidget(No no) {
    String widget = """
    Parent(
      child: new Container(
          ${_child(no)}
        ),
        style: ParentStyle()
          ${widthHeight(w, width: true, division: true)}
          ${widthHeight(h, width: false, division: true)}          
          ..alignmentContent.center()
          ${rotate(rotation)}
          ..background.color($color)
          ${_border()}
          ${_radius()}
          ${_shape()}
          ${shadow.print()},
    )
    """;
    return widget;
  }

  defaultWidget(No no) {
    String widget = """
    Container(
      alignment: Alignment.center,
      ${widthHeight(w, width: true)}
      ${widthHeight(h, width: false)}
      ${_decoration()}
      ${_child(no)}
    )
    """;
    return rotate(rotation, child: widget);
  }

  radiusCircular(String content) {
    if (withDivision) return content;
    return "Radius.circular($content)";
  }
}
