const { fixDouble, hexColorToFlutterColor, widthHeight, sz, rotate, constText } = require("../util");
const { Radius } = require("./submodels/radius");
const { Shadow } = require("./submodels/shadow");
var withDivision = require("../main");
var withSimpleCode = require("../main");

class Container {
  constructor(json) {
    this.type = Container;
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["w"]);
    this.h = parseFloat(json["h"]);
    this.gw = parseFloat(json["globalW"]);
    this.gh = parseFloat(json["globalH"]);
    this.id = json["name"];
    this.opacity = fixDouble(json['opacity']);
    this.withColor = json['wcolor'];
    this.haveImage = json['image'];
    this.rotation = fixDouble(json['rotation']);
    this.withGradient = json["color"]["startY"] != undefined;
    this.color = this._color(json["color"]);
    this.borderOpacity = fixDouble(json['borderOpacity']);
    this.borderColor = hexColorToFlutterColor(
      json['borderColor'].toString(), this.borderOpacity, true);
    this.borderWidth = parseFloat(json["borderWidth"]);
    this.withBorder = json['withBorder'];
    this.shape = json['shape'];
    this.radius =
      json['radius'] != null ? new Radius(json['radius']) : null;
    this.shadow = json['shadow'] != null
      ? new Shadow(json['shadow'], this.withColor)
      : null;
  }

  generateWidget(no) {
    let widget = withDivision.withDivision ? this._divisionWidget(no) : this._defaultWidget(no);
    return widget;
  }

  _child(no) {
    let child = no.children.length > 0
      ? no.children[0].widget.generateWidget(no.children[0])
      : null;
    child = child != null ? `child:${child},` : "";
    return child;
  }

  _decoration() {
    if (this.haveImage ||
      this.withBorder ||
      this.shape != "rectangle" ||
      this.shadow.visible ||
      this.radius != null || this.withGradient) {
      return `decoration: BoxDecoration(
        ${this.color}
        ${ this._border()}
        ${ this._radius()}
        ${ this._shape()}
        ${ this._image()}
        ${ this.shadow.print()}
         ), `;
    } else {
      return this.color;
    }
  }

  _border() {
    if (this.withBorder && this.borderWidth != 0) {
      if (withDivision.withDivision) return `..border(all: ${sz(this.borderWidth)},${this.borderColor})`;
      return `border: Border.all(${widthHeight(this.borderWidth, true)}${this.borderColor}),`;
    }
    return "";
  }

  _shape() {
    if (this.shape == "ellipse") {
      if (withDivision.withDivision) return `..borderRadius(all:${this.h})`;
      return `borderRadius: BorderRadius.all(Radius.elliptical(${this.w}, ${this.h})),`;
    } else if (this.shape == "circle") {
      if (withDivision.withDivision) return "..circle()";
      return "shape: BoxShape.circle,";
    }
    return "";
  }

  _image() {
    if (this.haveImage) {
      return `image: DecorationImage(
        image: AssetImage("assets/$id.png"),
      ),`;
    }
    return "";
  }

  _radius() {
    if (this.radius != null) {
      if (this.radius.isCircular()) {
        if (withDivision.withDivision) return `..borderRadius(all:${sz(this.radius.topLeft)})`;
        return `borderRadius: BorderRadius.circular(${sz(this.radius.topLeft)}),`;
      }
      var tL = this.radius.topLeft != 0
        ? `topLeft: ${_radiusCircular(sz(this.radius.topLeft))},`
        : "";
      var tR = this.radius.topRight != 0
        ? `topRight: ${_radiusCircular(sz(this.radius.topRight))},`
        : "";
      var bL = this.radius.bottomLeft != 0
        ? `bottomLeft: ${_radiusCircular(sz(this.radius.bottomLeft))},`
        : "";
      var bR = this.radius.bottomRight != 0
        ? `bottomRight: ${_radiusCircular(sz(this.radius.bottomRight))}`
        : "";
      if (withDivision.withDivision) return `..borderRadius(${tL}${tR}${bL}${bR})`;
      return `borderRadius: BorderRadius.only(${tL}${tR}${bL}${bR}),`;
    }
    return "";
  }

  _divisionWidget(no) {
    let widget = `
    Parent(
      child: Container(
        ${ this._child(no)}
      ),
      style: ParentStyle()
          ${ widthHeight(this.w, true, true)}
          ${ widthHeight(this.h, false, true)}
          ${ rotate(this.rotation)}
          ${this.color}
          ${ this._border()}
          ${ this._radius()}
          ${ this._shape()}
          ${ this.shadow.print()},
    )`;
    return widget;
  }

  _defaultWidget(no) {
    let widget = `
    Container(
      ${ widthHeight(this.w, true)}
       ${ widthHeight(this.h, false)}
       ${ this._decoration()}
       ${ this._child(no)}
    )`;
    return rotate(this.rotation, widget);
  }

  _radiusCircular(content) {
    if (withDivision.withDivision) return content;
    return `Radius.circular(${content})`;
  }
  _color(json) {
    if (this.haveImage) return "";
    if (this.withGradient) {
      return this._gradient(json);
    }
    let color = hexColorToFlutterColor(
      json.toString(), this.withColor ? this.opacity : 0,
      false, !withDivision.withDivision);
    if (color == "") return color;
    if (withDivision.withDivision) return `..background.color(${color})`;
    return color;
  }

  _gradient(json) {
    let withConst = !withSimpleCode.withSimpleCode;
    let isLinear = json["startR"] == undefined;
    let colors = "";
    for (let index = 0; index < json.colorStops.length; index++) {
      let stop = json.colorStops[index];
      colors += hexColorToFlutterColor(stop["color"], fixDouble(stop["opacity"]),
        false, false, !withConst) + (index == json.colorStops.length - 1 ? "" : ",");
    }
    if (isLinear) return this._linearGradient(json, colors, withConst);
    return this._radialGradient(json, colors, withConst);
  }

  _radialGradient(json, colors, withConst) {
    let content = `colors:[${colors}],
    radius: ${fixDouble(json.endR)},
    center: Alignment(${fixDouble(json.startX)}, ${fixDouble(json.startY)}),`;
    if (withDivision.withDivision) return `..radialGradient(${content})`;
    return `gradient: RadialGradient(${content}),`;
  }

  _linearGradient(json, colors, withConst) {

    let content = `begin: Alignment(${fixDouble(json.startX)}, ${fixDouble(json.startY)}),
    end: Alignment(${fixDouble(json.endX)}, ${fixDouble(json.endY)}),
    colors: [${colors}],`;
    if (withDivision.withDivision) return `..linearGradient(${content})`;
    return `gradient:${constText(withConst)}LinearGradient(${content}),`;
  }
}

module.exports = { Container };
