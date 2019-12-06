const { widthHeight, rotate, hexColorToFlutterColor, sz } = require("../../functions/util");

function default_widget(container, child) {
    let widget = `
    Container(
      ${ widthHeight(container.w, true)}
      ${ widthHeight(container.h, false)}
      ${ _decoration(container)}
      ${child}
    )`;
    return rotate(container.rotation, widget);
}


function _decoration(container) {
    const color = hexColorToFlutterColor(container.color, container.opacity, false, true);
    if (container.border != null || container.shape != "rectangle"
        || container.shadow != null || container.radius != null || container.gradient != null) {
        return `decoration: BoxDecoration(
        ${color}
        ${ _border(container)}
        ${ _radius(container)}
        ${ _shape(container)}
        ${ _shadow(container)}
        ), `;
    } else {
        return color;
    }
}

function _border(container) {
    if (container.border == null) return "";
    const borderWidth = container.border["borderWidth"];
    const color = hexColorToFlutterColor(container.border["color"], container.border["opacity"], false, true);
    return `border: Border.all(${widthHeight(borderWidth, true)}${color}),`;
}

function _radius(container) {
    const radius = container.radius;
    if (radius == null) return "";
    if (radius.isCircular())
        return `borderRadius: BorderRadius.circular(${sz(radius.topLeft)}),`;
    const tL = _onlyRadius("topLeft", radius.topLeft);
    const tR = _onlyRadius("topRight", radius.topRight);
    const bL = _onlyRadius("bottomLeft", radius.bottomLeft);
    const bR = _onlyRadius("bottomRight", radius.bottomRight);
    return `borderRadius: BorderRadius.only(${tL}${tR}${bL}${bR}),`;
}
function _onlyRadius(tag, value) {
    if (value == 0) return "";
    return `${tag}: Radius.circular(${sz(value)}),`;
}

function _shape(container) {
    if (container.shape == "rectangle") return "";
    if (container.shape == "ellipse")
        return `borderRadius: BorderRadius.all(Radius.elliptical(${container.w}, ${container.h})),`;
    return "shape: BoxShape.circle,";
}

function _shadow(container) {
    const shadow = container.shadow;
    if(shadow == null) return "";
    let offSet = `offset: Offset(${sz(shadow.x)},${sz(shadow.y)})`;
    let blurR = `${sz(shadow.blurRadius)}`;
    return `boxShadow:[BoxShadow(${offSet}, 'blurRadius': ${blurR},${shadow.color})],`;

}

module.exports = { default_widget };