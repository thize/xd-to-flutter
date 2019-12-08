const { default_widget } = require("./default_widget");
const { division_widget } = require("./division_widget");
const { Shadow } = require("../submodels/shadow");
var withDivision = require("../../json_to_flutter");

class Text {
  constructor(json) {   
    this.type = Text;
    this.json = json;
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["w"]);
    this.h = parseFloat(json["h"]);
    this.gw = parseFloat(json["gbW"]);
    this.gh = parseFloat(json["gbH"]);
    this.type = json['type'];
    this.text = json['text'];
    this.id = json['name'];
    this.withAreaBox = json['withAreaBox'];
    this.rotation = json['rotation'];
    this.opacity = json['opacity'];
    this.color = json['color'];
    this.textAlign = json['textAlign'];
    this.underline = json['underline'];
    this.strikethrough = json['strikethrough'];
    this.fontFamily = json['fontFamily'];
    this.fontWeight = json['fontWeight'];
    this.fontSize = json['fontSize'];
    this.shadow = json['shadow'] == null || json["color"] == null ? null : new Shadow(json['shadow']);
  }

  generateWidget() {
    const text = new Text(this.json);
    const withDiv = withDivision.withDivision;
    let widget = withDiv ? division_widget(text) : default_widget(text);
    return widget;
  }
}

module.exports = { Text };
