const { fixDouble, hexColorToFlutterColor, sz, widthHeight, rotate, constText } = require("../util");
const { Shadow } = require("./submodels/shadow");
var withDivision = require("../main");
var withSimpleCode = require("../main");

class Text {
  constructor(json) {
    this.type = Text;
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["w"]);
    this.h = parseFloat(json["h"]);
    this.gw = parseFloat(json["globalW"]);
    this.gh = parseFloat(json["globalH"]);
    this.type = json['type'];
    this.text = json['text'];
    this.id = this.text;
    this.withAreaBox = json['withAreaBox'];
    this.withColor = json['wcolor'];
    this.rotation = fixDouble(json['rotation']);
    this.opacity = fixDouble(json['opacity']);
    this.color = hexColorToFlutterColor(
      json['color'].toString(), this.withColor ? this.opacity : 0, true, !withDivision.withDivision, withSimpleCode.withSimpleCode);
    this.textAlign = json['textAlign'];
    this.underline = json['underline'];
    this.strikethrough = json['strikethrough'];
    this.fontFamily = json['fontFamily'];
    this.fontWeight = json['fontWeight'];
    this.fontSize = fixDouble(json['fontSize']);
    this.shadow = json['shadow'] != null
      ? new Shadow(json['shadow'], this.withColor)
      : null;
  }

  generateWidget() {
    let widget = withDivision.withDivision ? this._divisionWidget() : this._defaultWidget();
    if (this.withAreaBox && !withDivision.withDivision) {
      return `Container(${widthHeight(this.w, true, false)}${widthHeight(this.h, false, false)}child:${widget},)`
    }
    return widget;
  }

  _decoration() {
    let content;
    if (this.strikethrough && this.underline) {
      content = `TextDecoration.combine(
        [TextDecoration.lineThrough, TextDecoration.underline])`;
    } else if (this.strikethrough) {
      content = "TextDecoration.underline";
    } else if (this.underline) {
      content = "TextDecoration.underline";
    }
    if (content != undefined) {
      if (withDivision.withDivision) {
        return `..textDecoration(${content})`;
      }
      return `decoration: ${content},`;
    }
    return "";
  }

  _align() {
    let textAlign = withDivision.withDivision ? "..textAlign." : "textAlign: TextAlign.";
    let end = (withDivision.withDivision ? '()' : `,`);
    if (this.textAlign == 'right') {
      return `${textAlign}end` + end;
    } else if (this.textAlign == 'center') {
      return `${textAlign}center` + end;
    }
    return "";
  }

  _fontWeight() {
    this.fontWeight = this.fontWeight.toLowerCase().replace("-", "");
    if (this.fontWeight == "thin") {
      this.fontWeight = "100";
    } else if (this.fontWeight == "extraligth") {
      this.fontWeight = "200";
    } else if (this.fontWeight == "light") {
      this.fontWeight = "300";
    } else if (this.fontWeight == "medium") {
      this.fontWeight = "500";
    } else if (this.fontWeight == "semibold") {
      this.fontWeight = "600";
    } else if (this.fontWeight == "bold") {
      this.fontWeight = "700";
      if (withDivision.withDivision) return "..bold()";
      return 'fontWeight: FontWeight.bold,';
    } else if (this.fontWeight == "extrabold") {
      this.fontWeight = "800";
    } else if (this.fontWeight == "black") {
      this.fontWeight = "900";
    } else {
      this.fontWeight = "400";
      return "";
    }
    let content = `FontWeight.w${this.fontWeight}`;
    if (withDivision.withDivision) return `..fontWeight(${content})`;
    return `fontWeight: ${content},`;
  }

  _defaultWidget() {
    let withConst = !withSimpleCode.withSimpleCode;
    let widget = `${constText(withConst)}Text(
      '${this.text}',
      ${this._align()}
      style: TextStyle(
        fontFamily: '${this.fontFamily}',
        fontSize: ${sz(this.fontSize)},
        ${this._fontWeight()}
        ${this.color}
        ${this._decoration()}
        ${this.shadow.print(true)}
      ),
    )`;
    return rotate(this.rotation, widget);;
  }

  _divisionWidget() {
    let widget = `Txt(
      '${this.text}',
        style: TxtStyle()
          ..fontFamily('${this.fontFamily}')
          ..fontSize(${sz(this.fontSize)})
          ${this._align()}
          ${this._fontWeight()}
          ${rotate(this.rotation)}
          ..textColor(${this.color})
          ${this.shadow.print(true)}
          ${this._withAreaBox()}
          ${this._decoration()},
      ) `;
    return widget;
  }

  _withAreaBox() {
    if (this.withAreaBox) {
      return `
      ${widthHeight(this.w, true, true)}${widthHeight(this.h, false, true)}
      `;
    }
    return "";
  }
}

module.exports = { Text };
