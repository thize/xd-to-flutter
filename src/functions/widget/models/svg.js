const { fixDouble, widthHeight } = require("../util");

class Svg {
  constructor(json) {
    this.type = Svg;
    this.rotation = fixDouble(json['rotation']);
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["w"]);
    this.h = parseFloat(json["h"]);
    this.gw = parseFloat(json["globalW"]);
    this.gh = parseFloat(json["globalH"]);
    this.id = json["name"];
  }

  generateWidget(no) {
   return `SvgPicture.asset(
      "assets/${this.id}.svg",
      ${ widthHeight(this.w,true) }
      ${ widthHeight(this.h, false) }
    )`;
  }
}

module.exports = { Svg };