const { color, allOpacity, offSet } = require("./global");

function widgetText(node) {
  const json = _jsonText(node);
  return `new Text(
    "${json["text"]}",    
    ${_textAlign(json)}style: TextStyle(
      ${_fontFamily(json)}${_fontWeight(json)}${_fontSize(json)}
      color:${color(json["color"], allOpacity(json["opacity"], json["colorOpacity"]))}${_textUnderline(json)}${_textShadow(json)}
    ),
  )`;
}

function widgetTextStyle(node) {
  const json = _jsonText(node);
  return `style: TextStyle(
      ${_fontFamily(json)}${_fontWeight(json)}${_fontSize(json)}
      color:${color(json["color"], allOpacity(json["opacity"], json["colorOpacity"]))}${_textUnderline(json)}${_textShadow(json)}
  )`;
}

function _jsonText(node) {
  return {
    "text": node.text.replace("\n", "\\n"),
    "color": node.fill.toHex(true),
    "colorOpacity": node.fill.a / 255,
    "underline": node.underline,
    "textAlign": node.textAlign,
    "fontFamilty": node.fontFamily,
    "fontWeight": node.fontStyle,
    "fontSize": node.fontSize,
    "opacity": node.opacity,
    "shadow": node.shadow == null ? { "visible": false } : {
      "x": node.shadow["x"],
      "y": node.shadow["y"],
      "color": node.shadow["color"].toHex(true),
      "colorOpacity": node.shadow["color"].a / 255,
      "blur": node.shadow["blur"],
      "visible": node.shadow["visible"]
    }
  };
}

function _textShadow(json) {
  return `${!json["shadow"]["visible"] ? '' : `
    shadows:[
    Shadow(
      offset: ${offSet(json)},
      color: ${color(json["shadow"]["color"], allOpacity(json["opacity"], json["shadow"]["colorOpacity"]))}
      blurRadius: sz(${json["shadow"]["blur"]}),
    ),
  ],`} `;
}

function _textUnderline(json) {
  return ` ${json["underline"] ? `
    decoration: TextDecoration.underline,` : ''}`;
}

function _textAlign(json) {
  return `${json["textAlign"] == "left" ? '' : `textAlign: TextAlign.${json["textAlign"]},
    `}`;
}

function _fontFamily(json) {
  return `fontFamily: "${json["fontFamilty"]}",`;
}


function _fontWeight(json) {
  let fontWeight = json["fontWeight"];
  fontWeight = fontWeight.toLowerCase().replace("-", "");
  if (fontWeight == "thin") {
    fontWeight = "100";
  } else if (fontWeight == "extraligth") {
    fontWeight = "200";
  } else if (fontWeight == "light") {
    fontWeight = "300";
  } else if (fontWeight == "medium") {
    fontWeight = "500";
  } else if (fontWeight == "semibold") {
    fontWeight = "600";
  } else if (fontWeight == "bold") {
    fontWeight = "700";
  } else if (fontWeight == "extrabold") {
    fontWeight = "800";
  } else if (fontWeight == "black") {
    fontWeight = "900";
  } else {
    fontWeight = "400";
    return "";
  }
  return `fontWeight: FontWeight.w${fontWeight},`;
}

function _fontSize(json) {
  return `
    fontSize: sz(${json["fontSize"]}),`;
}



module.exports = { widgetText, widgetTextStyle };