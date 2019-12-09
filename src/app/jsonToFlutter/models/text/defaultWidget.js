const { widthHeight, rotate, hexColorToFlutterColor, sz } = require("../../functions/util");

function defaultWidget(text) {  
  let widget = `Text(
    "${text.text}",
    ${_align(text)}
    style: TextStyle(
      fontFamily: "${text.fontFamily}",
      fontSize: ${sz(text.fontSize)},
      ${hexColorToFlutterColor(text.color, text.opacity, false, true)}
      ${_decoration(text)}
      ${_fontWeight(text)}
      ${_shadow(text)}
    ),
  )`;
  if (text.withAreaBox) {
    widget = `SizedBox(${widthHeight(text.w, true, false)}${widthHeight(text.h, false, false)}child:${widget},)`
  }
  return rotate(text.rotation, widget);
}

function _align(text) {
  let textAlign = "textAlign: TextAlign.";
  if (text.textAlign == 'right') {
    return `${textAlign}end,`;
  } else if (text.textAlign == 'center') {
    return `${textAlign}center,`;
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
    return `decoration: ${content},`;
  }
  return "";
}

function _fontWeight(text) {
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
    return 'fontWeight: FontWeight.bold,';
  } else if (text.fontWeight == "extrabold") {
    text.fontWeight = "800";
  } else if (text.fontWeight == "black") {
    text.fontWeight = "900";
  } else {
    text.fontWeight = "400";
    return "";
  }
  return `fontWeight: FontWeight.w${text.fontWeight},`;
}

function _shadow(text) {
  const shadow = text.shadow;
  if(shadow == null) return "";
  let offSet = `offset: Offset(${sz(shadow.x)},${sz(shadow.y)})`;
  let blurR = `${sz(shadow.blurRadius)}`;
  return `shadows:[Shadow(${offSet}, blurRadius: ${blurR},${shadow.color})],`;
}

module.exports = { defaultWidget };