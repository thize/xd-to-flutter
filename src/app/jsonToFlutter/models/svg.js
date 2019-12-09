const { widthHeight } = require("../functions/util");

class Svg {
  constructor(json) {
    this.type = Svg;
    this.rotation = json['rotation'];
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["w"]);
    this.h = parseFloat(json["h"]);
    this.gw = parseFloat(json["gbW"]);
    this.gh = parseFloat(json["gbH"]);
    this.id = json["name"];
  }

  generateWidget(no) {
    return `SvgPicture.asset(
      "assets/${this.id}.svg",
      ${ widthHeight(this.w, true)}
      ${ widthHeight(this.h, false)}
    )`;
  }
}

module.exports = { Svg };