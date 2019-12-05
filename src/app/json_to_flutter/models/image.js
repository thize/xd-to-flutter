const { widthHeight } = require("../functions/util");

class Image {
    constructor(json) {
        this.type = Image;
        this.rotation = json['rotation'];
        this.x = parseFloat(json["x"]);
        this.y = parseFloat(json["y"]);
        this.w = parseFloat(json["w"]);
        this.h = parseFloat(json["h"]);
        this.gw = parseFloat(json["globalW"]);
        this.gh = parseFloat(json["globalH"]);
        this.id = json["name"];
    }

    generateWidget(no) {
        return `Image.asset(
      "assets/${this.id}.png",
      ${ widthHeight(this.w, true)}
      ${ widthHeight(this.h, false)}
    )`;
    }
}

module.exports = { Image };