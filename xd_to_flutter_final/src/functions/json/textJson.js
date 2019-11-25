function textJson(node) {
    var color = node.fill["value"] != null;
    let withAreaBox = node.areaBox != null;
    return JSON.stringify({
        "type": "text",
        "name": node.name,
        "text": node.text,
        "w": node.globalBounds["width"],
        "h": node.globalBounds["height"],
        "globalW": node.globalBounds["width"],
        "globalH": node.globalBounds["height"],
        "x": node.globalBounds["x"],
        "y": node.globalBounds["y"], "withAreaBox": withAreaBox,
        "wcolor": node.fillEnabled,
        "color": node.fill.toHex(true),
        "wcolor": node.fillEnabled,
        "textAlign": node.textAlign,
        "underline": node.underline,
        "rotation":  node.rotation,
        "strikethrough": node.strikethrough,
        "fontFamily": node.fontFamily,
        "fontWeight": node.fontStyle.toLowerCase().replace("-", ""),
        "fontSize": node.fontSize,
        "opacity": (color ? node.fill.a / 255 : 1) * node.opacity,
        "shadow": node.shadow == null ? { "visible": false } : {
            "x": node.shadow["x"],
            "y": node.shadow["y"],
            "color": node.shadow["color"].toHex(true),
            "opacity": (color ? node.shadow["color"].a / 255 : 1) * node.opacity,
            "blur": node.shadow["blur"],
            "visible": node.shadow["visible"]
        }
    });
};

module.exports = { textJson };