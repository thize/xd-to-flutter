const { fixDouble, hexColorToFlutterColor, sz } = require("../../util");
var withDivision = require("../../main");

class Shadow {
  constructor(json, withColor) {
    this.visible = json['visible'] && withColor;
    if (this.visible) {
      this.x = fixDouble(json['x']);
      this.y = fixDouble(json['y']);
      this.opacity = fixDouble(json['opacity']);
      this.color = hexColorToFlutterColor(json['color'], this.opacity);
      this.blurRadius = fixDouble(json['blur']);
    }
  }

  print(isText) {
    isText = isText == null ? false : isText;
    if (this.visible) {
      let offSet = `offset: Offset(${sz(this.x)},${sz(this.y)})`;
      let blurR = `${sz(this.blurRadius)}`;
      if (withDivision.withDivision)
        return `..boxShadow(${this.color}, blur: ${blurR}, ${offSet})`;
      return `
    ${ isText ? "shadows" : "boxShadow"}: [
      BoxShadow(
        ${offSet}, ${this.color}blurRadius: ${blurR},
      ),
    ],
    `;
    }
    return "";
  }
}

module.exports = { Shadow };
