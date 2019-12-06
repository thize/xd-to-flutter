const { default_widget } = require("./default_widget");
const { division_widget } = require("./division_widget");
const { Radius } = require("../submodels/radius");
const { Shadow } = require("../submodels/shadow");
var withDivision = require("../../json_to_flutter");

class Container {
  constructor(json) {
    this.json = json;
    this.type = Container;
    this.id = json["name"];
    this.x = parseFloat(json["x"]);
    this.y = parseFloat(json["y"]);
    this.w = parseFloat(json["w"]);
    this.h = parseFloat(json["h"]);
    this.gw = parseFloat(json["gbW"]);
    this.gh = parseFloat(json["gbH"]);
    this.rotation = json['rotation'];
    this.opacity = json['opacity'];
    this.gradient = json['gradient'];
    this.color = json["color"];
    this.border = json["border"];
    this.shape = json['shape'];
    this.radius = json['radius'] == null ? null : new Radius(json['radius']);
    this.shadow = json['shadow'] == null || json["color"] == null ? null : new Shadow(json['shadow']);
    this.blend = json['blend'];
  }

  generateWidget(no) {
    const container = new Container(this.json);
    const child = this._child(no);
    const withDiv = withDivision.withDivision;
    let widget = withDiv ? division_widget(container, child) : default_widget(container, child);
    return widget;
  }

  _child(no) {
    let child = no.children.length > 0
      ? no.children[0].widget.generateWidget(no.children[0])
      : null;
    child = child != null ? `child:${child},` : "";
    return child;
  }
}

module.exports = { Container };
