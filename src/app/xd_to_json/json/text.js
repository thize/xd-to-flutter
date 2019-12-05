const { fixDouble } = require("../util");

function text(node) {
    return JSON.stringify({
        "type": "text",
        "name": node.name,
        "x": fixDouble(node.globalBounds["x"]),
        "y": fixDouble(node.globalBounds["y"]),
        "w": fixDouble(node.width),
        "h": fixDouble(node.height),
        "gbW": fixDouble(node.globalBounds["width"]),
        "gbH": fixDouble(node.globalBounds["height"]),
        "rotation": fixDouble(node.rotation),
        "opacity": fixDouble((node.fillEnabled ? node.fill.a / 255 : 1) * node.opacity),
        "text": node.text.replace(new RegExp("\n", 'g'), "\\n"),
        "withAreaBox": node.areaBox != null,
        "color": node.fillEnabled ? node.fill.toHex(true) : null,
        "textAlign": node.textAlign,
        "underline": node.underline,
        "strikethrough": node.strikethrough,
        "fontFamily": node.fontFamily,
        "fontWeight": node.fontStyle.toLowerCase().replace("-", ""),
        "fontSize": node.fontSize,
        "shadow": node.shadow != null && node.shadow.visible ? node.shadow : null,
        "border": node.strokeEnabled ? {
            "color": node.stroke.toHex(true),
            "opacity": node.stroke.a / 255 * node.opacity,
            "borderWidth": fixDouble(node.strokeWidth),
        } : null,
    });
};

module.exports = { text };