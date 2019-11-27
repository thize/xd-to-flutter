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
    if (this.visible) {
      let offSet = `offset: Offset(${sz(this.x)},${sz(this.y)})`;
      let blurR = `${sz(this.blurRadius)}`;
      let content = `${offSet}, ${withDivision.withDivision ? 'blur' : 'blurRadius'}: ${blurR},${this.color}`;
      if (isText) {
        if (withDivision.withDivision)
          return `..textShadow(${content})`;
        return `shadows:[Shadow(${content})],`;
      } else {
        if (withDivision.withDivision)
          return `..boxShadow(${content})`;
        return `boxShadow:[BoxShadow(${content})],`;
      }
    }
    return "";
  }
}

module.exports = { Shadow };

