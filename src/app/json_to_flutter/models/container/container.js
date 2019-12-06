const { default_widget } = require("./default_widget");
const { Radius } = require("../submodels/radius");
const { Shadow } = require("../submodels/shadow");
var withDivision = require("../../json_to_flutter");

class Container {
  constructor(json) {    
    
    this.json = json;
    this.type = Container;
    this.id = json["name"];
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["w"]);
    this.h = parseFloat(json["h"]);
    this.gw = parseFloat(json["gbW"]);
    this.gh = parseFloat(json["gbH"]);
    this.rotation = json['rotation'];
    this.opacity = json['opacity'];
    this.gradient = json['gradient'];
    this.color = json["color"];
    this.border = json["border"];
    this.shape = json['shape'];
    this.radius = json['radius'] == null ? null : new Radius(json['radius']);
    this.shadow = json['shadow'] == null || json["color"] == null ? null : new Shadow(json['shadow']);
    this.blend = json['blend'];
  }

  generateWidget(no) {
    let widget = default_widget(new Container(this.json), this._child(no));//withDivision.withDivision ? this._divisionWidget(no) : this._defaultWidget(no);
    return widget;
  }

  _child(no) {
    let child = no.children.length > 0
      ? no.children[0].widget.generateWidget(no.children[0])
      : null;
    child = child != null ? `child:${child},` : "";
    return child;
  }
  /*
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
        ${this._child(no)}
        style: ParentStyle()
            ${ widthHeight(this.w, true, true)}
            ${ widthHeight(this.h, false, true)}
        ..alignmentContent.center()
            ${ rotate(this.rotation)}
            ${this.color}
            ${ this._border()}
            ${ this._radius()}
            ${ this._shape()}
            ${ this.shadow.print()},
      )`;
      return widget;
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
      let isLinear = json["startR"] == undefined;
      let colors = "";
      for (let index = 0; index < json.colorStops.length; index++) {
        let stop = json.colorStops[index];
        colors += hexColorToFlutterColor(stop["color"], stop["opacity"],
          false, false) + (index == json.colorStops.length - 1 ? "" : ",");
      }
      if (isLinear) return this._linearGradient(json, colors);
      return this._radialGradient(json, colors);
    }
  
    _radialGradient(json, colors) {
      let content = `colors:[${colors}],
      radius: ${json.endR},
      center: Alignment(${json.startX}, ${json.startY}),`;
      if (withDivision.withDivision) return `..radialGradient(${content})`;
      return `gradient: RadialGradient(${content}),`;
    }
  
    _linearGradient(json, colors) {
      let content = `begin: Alignment(${json.startX}, ${json.startY}),
      end: Alignment(${json.endX}, ${json.endY}),
      colors: [${colors}],`;
      if (withDivision.withDivision) return `..linearGradient(${content})`;
      return `gradient: LinearGradient(${content}),`;
    }*/
}

module.exports = { Container };
