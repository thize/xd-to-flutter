const { rectangleJson } = require("./rectangleJson");
const { svgJson } = require("./svgJson");
const { textJson } = require("./textJson");

function generateJson(list) {
  let all;
  list.forEach((a, i) => {
    if (all == null) {
      all = `"${i}": ${_itemJson(a)}`;
    } else {
      all += `,"${i}": ${_itemJson(a)}`;
    }
  });
  var json = JSON.parse(JSON.stringify(`{${all}}`));
  return json;
}

function _itemJson(node) {
  var ncn = node.constructor.name;
  if (ncn == "BooleanGroup" || ncn == "Path" || (ncn == "Group" && node.name.includes("svg"))) {
    return svgJson(node);
  } else if (ncn == "Text") {
    return textJson(node);
  } else if (ncn == "Artboard" ||
    ncn == "Ellipse" ||
    ncn == "Rectangle" ||
    ncn == "Line") {
    return rectangleJson(node);
  }
}

module.exports = { generateJson };

