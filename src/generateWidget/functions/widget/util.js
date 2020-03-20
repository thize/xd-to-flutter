var withSimpleCode = require("./main");
var withDivision = require("./main");

function fixDouble(value) {
  try {
    return parseFloat(value.toFixed(2));
  } catch (e) {
    return parseFloat((parseFloat(value)).toFixed(2));
  }
}

function sz(value, width) {
  let tag = width == null ? '' : width ? 'w' : 'h';
  if (withSimpleCode.withSimpleCode && value > 0) {
    return tag + `sz(${value})`;
  }
  return `${value}`;
}

function hexColorToFlutterColor(hexColor, opacity, transparent, withTag, withConst) {
  transparent = transparent == null ? false : transparent;
  withTag = withTag == null ? true : withTag;
  let color;
  if (opacity == 0) {
    if (transparent)
      color = "Colors.transparent";
    else
      return "";
  } else {
    color = _hexToMaterialColor(`Color(${hexColor.replace("#", "0xff")})`) + (opacity == 1 ? "" : `.withOpacity(${opacity})`);
    if (withConst == null || withConst)
      color = `const ${color}`;
  }
  if (!withTag) return `${color}`;
  return `color: ${color}` + (withDivision.withDivision ? "" : ",");
}

function constText(boolean) {
  if (boolean) return "const ";
  return '';
}
function _hexToMaterialColor(color) {
  return color;
}

function widthHeight(value, width, division) {
  division = division == null ? false : division;
  let type = "height";
  if (value != 0) {
    if (width) type = "width";
    if (division) return `..${type}(${sz(value, width)})`;
    return `${type}: ${sz(value, width)},`;
  }
  return "";
}

function rotate(rotation, child) {
  if (rotation > 0) {
    if (withDivision.withDivision) return `..rotate(${fixDouble(rotation / 360)})`;
    return `
    Transform.rotate(
      angle: ${rotation} * pi / 180,
    child: ${child},
    )
    `;
  }
  return child != null ? child : "";
}

module.exports = { rotate, widthHeight, hexColorToFlutterColor, sz, fixDouble, constText };