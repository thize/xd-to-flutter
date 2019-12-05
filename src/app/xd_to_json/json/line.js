const { fixDouble } = require("../util");

function line(node) {
    return JSON.stringify({
        "type": "line",
        "name": node.name,
        "x": fixDouble(node.globalBounds["x"]),
        "y": fixDouble(node.globalBounds["y"]),
        "w": fixDouble(node.width),
        "h": fixDouble(node.height),
        "gbW": fixDouble(node.globalBounds["width"]),
        "gbH": fixDouble(node.globalBounds["height"]),
        "rotation": fixDouble(node.rotation),
        "opacity": fixDouble(node.opacity),
        "border": node.strokeEnabled ? {
            "color": node.stroke.toHex(true),
            "opacity": node.stroke.a / 255 * node.opacity,
            "borderWidth": fixDouble(node.strokeWidth),
        } : null,
        "shadow": node.shadow != null && node.shadow.visible ? node.shadow : null,
        "blend": null,
        "color": node.stroke.toHex(true),
    });
}

module.exports = { line };