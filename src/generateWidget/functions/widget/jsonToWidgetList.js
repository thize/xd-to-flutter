const { Container } = require("./models/container");
const { Svg } = require("./models/svg");
const { Text } = require("./models/text");

async function jsonToWidgetList(json) {
  let widgets = [];
  try {
    json = JSON.parse(json);
    for (let i = 0; i < 9999999; i++) {
      let widget = _addWidgetOnList(json[`${i}`]);
      if (widget == null) break;
      widgets.push(widget);
    }
  } catch (e) {
    console.log("Without JSON");
    return null;
  }
  return widgets;
}

function _addWidgetOnList(json) {
  if (json == null) return null;
  switch (json["type"]) {
    case "container":
      return new Container(json);
    case "svg":
      return new Svg(json);
    default:
      return new Text(json);
  }
}

module.exports = { jsonToWidgetList };