const { fixDouble } = require("../util");

function polygon(node) {
    return JSON.stringify({
        "type": "polygon",
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
        "color": node.fillEnabled ? node.fill.toHex(true) : null,
        "cornerCount": node.cornerCount,
        "cornerRadius": fixDouble(node.hasRoundedCorners ? node.cornerRadii : null),
    });
}

module.exports = { polygon };