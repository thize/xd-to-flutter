const { fixDouble, hexColorToFlutterColor, sz } = require("../util");
const { Shadow } = require("./submodels/shadow");

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
    this.text = json['text'].replace("\n", "\\n");
    this.id = this.text;
    this.withAreaBox = json['withAreaBox'];
    this.withColor = json['wcolor'];
    this.rotation = fixDouble(json['rotation']);
    this.opacity = fixDouble(json['opacity']);
    this.color = hexColorToFlutterColor(
      json['color'].toString(), this.withColor ? this.opacity : 0);
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

  generateWidget(no) {
    return `
    Text(
      "${this.text}",
      overflow: TextOverflow.ellipsis,
      style: TextStyle(
        fontFamily: "${this.fontFamily}",
        fontSize: ${sz(this.fontSize)},
        ${this._fontWeight()}
        ${this.color}
        ${this._decoration()}
      ),
    )
    `;
    //${shadow.print(isText: true)}
  }

  _decoration() {
    if (this.strikethrough && this.underline) {
      console.log("strikethrough && underline");
    } else if (this.strikethrough) {
      return "decoration: TextDecoration.underline,";
    } else if (this.underline) {
      return "decoration: TextDecoration.underline,";
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
      return 'fontWeight: FontWeight.bold,';
    } else if (this.fontWeight == "extrabold") {
      this.fontWeight = "800";
    } else if (this.fontWeight == "black") {
      this.fontWeight = "900";
    } else {
      this.fontWeight = "400";
      return "";
    }
    return `fontWeight: FontWeight.w${this.fontWeight},`;
  }
}

module.exports = { Text };

