const { hexColorToFlutterColor, sz } = require("../../functions/util");
var withDivision = require("../../json_to_flutter");

class Shadow {
  constructor(json, withColor) {
    this.visible = json['visible'] && withColor;
    if (this.visible) {
      this.x = json['x'];
      this.y = json['y'];
      this.opacity = json['opacity'];
      this.color = hexColorToFlutterColor(json['color'], this.opacity);
      this.blurRadius = json['blur'];
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

