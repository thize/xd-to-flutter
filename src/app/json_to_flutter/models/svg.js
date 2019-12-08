const { widthHeight } = require("../functions/util");

class Svg {
  constructor(json) {
    this.type = Svg;
    this.rotation = json['rotation'];
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["gbW"]);
    this.h = parseFloat(json["gbH"]);
    this.id = json["name"];
  }

  generateWidget(no) {
    return `Container(
      color:Colors.red,
      ${ widthHeight(this.w, true)}
      ${ widthHeight(this.h, false)}
    )`;
    return `SvgPicture.asset(
      "assets/${this.id}.svg",
      ${ widthHeight(this.w, true)}
      ${ widthHeight(this.h, false)}
    )`;
  }
}

module.exports = { Svg };