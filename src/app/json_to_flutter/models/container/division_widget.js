const { widthHeight, rotate, hexColorToFlutterColor, sz } = require("../../functions/util");

function division_widget(container, child) {
  let color = hexColorToFlutterColor(container.color, container.opacity, false, false);
  color = color == "" ? "" : `..background.color(${color})`;
  let widget = `
      Parent(
        ${child}
        style: ParentStyle()
            ${ widthHeight(container.w, true, true)}
            ${ widthHeight(container.h, false, true)}
            ${ rotate(container.rotation)}
            ${color}
            ${_border(container)}
            ${_radius(container)}
            ${_shape(container)}
            ${_shadow(container)}
            
      )`;
  return widget;
}

function _border(container) {
  if (container.border == null) return "";
  const borderWidth = container.border["borderWidth"];
  const color = hexColorToFlutterColor(container.border["color"], container.border["opacity"], false, true);
  return `..border(all:${sz(borderWidth)},${color}),`;
}


function _radius(container) {
  const radius = container.radius;
  if (radius == null) return "";
  if (radius.isCircular())
    return `..borderRadius(all:${sz(radius.topLeft)})`;
  const tL = _onlyRadius("topLeft", radius.topLeft);
  const tR = _onlyRadius("topRight", radius.topRight);
  const bL = _onlyRadius("bottomLeft", radius.bottomLeft);
  const bR = _onlyRadius("bottomRight", radius.bottomRight);
  return `..borderRadius(${tL}${tR}${bL}${bR})`;
}

function _onlyRadius(tag, value) {
  if (value == 0) return "";
  return `${tag}: Radius.circular(${sz(value)}),`;
}

function _shape(container) {
  if (container.shape == "ellipse") {
    return `..borderRadius(all:${container.h})`;
  } else if (container.shape == "circle") {
    return "..circle()";
  }
  return "";
}

function _shadow(container) {
  const shadow = container.shadow;
  if (shadow == null) return "";
  let offSet = `offset: Offset(${sz(shadow.x)},${sz(shadow.y)})`;
  let blurR = `${sz(shadow.blurRadius)}`;
  return `..boxShadow(${offSet}, blurRadius: ${blurR},${shadow.color})`;
}

module.exports = { division_widget };