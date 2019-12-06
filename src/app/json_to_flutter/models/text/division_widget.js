const { widthHeight, rotate, hexColorToFlutterColor, sz } = require("../../functions/util");

function division_widget(text) {
  let widget = `Txt(
    "${text.text}",
      style: TxtStyle()
        ..fontFamily("${text.fontFamily}")
        ..fontSize(${sz(text.fontSize)})
        ${_align(text)}
        ${_fontWeight(text)}
        ${rotate(text.rotation)}
        ..textColor(${hexColorToFlutterColor(text.color, text.opacity, false, false)})
        ${_withAreaBox(text)}
        ${_decoration(text)}
        ${_shadow(text)}
        ) `;
  return widget;
}

function _align(text) {
  let textAlign = "..textAlign."
  if (text.textAlign == 'right') {
    return `${textAlign}end()`;
  } else if (text.textAlign == 'center') {
    return `${textAlign}center()`;
  }
  return "";
}

function _fontWeight(text) {
  text.fontWeight = text.fontWeight.toLowerCase().replace("-", "");
  if (text.fontWeight == "thin") {
    text.fontWeight = "100";
  } else if (text.fontWeight == "extraligth") {
    text.fontWeight = "200";
  } else if (text.fontWeight == "light") {
    text.fontWeight = "300";
  } else if (text.fontWeight == "medium") {
    text.fontWeight = "500";
  } else if (text.fontWeight == "semibold") {
    text.fontWeight = "600";
  } else if (text.fontWeight == "bold") {
    text.fontWeight = "700";
    return "..bold()";
  } else if (text.fontWeight == "extrabold") {
    text.fontWeight = "800";
  } else if (text.fontWeight == "black") {
    text.fontWeight = "900";
  } else {
    text.fontWeight = "400";
    return "";
  }
  let content = `FontWeight.w${text.fontWeight}`;
  return `..fontWeight(${content})`;
}

function _withAreaBox(text) {
  if (text.withAreaBox) {
    return `
    ${widthHeight(text.w, true, true)}${widthHeight(text.h, false, true)}
    `;
  }
  return "";
}

function _decoration(text) {
  let content;
  if (text.strikethrough && text.underline) {
    content = `TextDecoration.combine(
      [TextDecoration.lineThrough, TextDecoration.underline])`;
  } else if (text.strikethrough) {
    content = "TextDecoration.lineThrough";
  } else if (text.underline) {
    content = "TextDecoration.underline";
  }
  if (content != undefined) {
    return `..textDecoration(${content})`;
  }
  return "";
}

function _shadow(text) {
  const shadow = text.shadow;
  if (shadow == null) return "";
  let offSet = `offset: Offset(${sz(shadow.x)},${sz(shadow.y)})`;
  let blurR = `${sz(shadow.blurRadius)}`;  
  return `..textShadow(${offSet}, blurRadius: ${blurR},${shadow.color})`;
}

module.exports = { division_widget };