const { hexColorToFlutterColor, sz } = require("../../functions/util");
var withDivision = require("../../json_to_flutter");

class Shadow {
  constructor(json) {
    this.x = json['x'];
    this.y = json['y'];
    this.opacity = json['opacity'];
    this.color = hexColorToFlutterColor(json['color'], this.opacity);
    this.blurRadius = json['blur'];
  }
}

module.exports = { Shadow };

