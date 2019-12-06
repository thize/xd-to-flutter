const { Container } = require("../models/container/container");
const { Svg } = require("../models/svg");
const { Text } = require("../models/text");
const { Image } = require("../models/image");

async function json_to_widgets(json) {
  let widgets = [];
  json = JSON.parse(json);
  for (let i = 0; i < 9999999; i++) {
    let widget = _addWidgetOnList(json[`${i}`]);
    if (widget == null) break;
    widgets.push(widget);
  }
  return widgets;
}

function _addWidgetOnList(json) {
  if (json == null) return null;
   
  switch (json["type"]) {
    case "rectangle":
      return new Container(json);
    case "image":
      return new Image(json);
    case "svg":
      return new Svg(json);
    case "text":
      return new Text(json);
    default:
      throw `${json["type"]} not implemented yet`;
  }
}

module.exports = { json_to_widgets };
