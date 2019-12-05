const { fixDouble, getGradient } = require("../util");

function rectangle(node) {
    let w, h, shape;
    if (node.constructor.name == "Ellipse") {
        w = node.radiusX * 2;
        h = node.radiusY * 2;
        if (node.isCircle) {
            shape = "circle";
        } else {
            shape = "ellipse"
        }
    } else {
        w = node.width;
        h = node.height;
        shape = "rectangle";
    }
    let isGradient = node.fill["value"] == null;
    let gradient;
    if (isGradient) {
        gradient = getGradient(node);
    }
    return JSON.stringify({
        "type": "rectangle",
        "name": node.name,
        "x": fixDouble(node.globalBounds["x"]),
        "y": fixDouble(node.globalBounds["y"]),
        "w": fixDouble(w),
        "h": fixDouble(h),
        "gbW": fixDouble(node.globalBounds["width"]),
        "gbH": fixDouble(node.globalBounds["height"]),
        "rotation": fixDouble(node.rotation),
        "opacity": fixDouble((isGradient ? 1 : (node.fill.a / 255)) * node.opacity),
        "border": node.strokeEnabled ? {
            "color": node.stroke.toHex(true),
            "opacity": fixDouble(node.stroke.a / 255 * node.opacity),
            "borderWidth": fixDouble(node.strokeWidth),
        } : null,
        "shadow": node.shadow != null && node.shadow.visible ? node.shadow : null,
        "blend": null,
        "color": isGradient || !node.fillEnabled ? null : node.fill.toHex(true),
        "radius": fixDouble(node.hasRoundedCorners ? node.cornerRadii : null),
        "shape": shape,
        "gradient": isGradient ? gradient : null,
    });
}

module.exports = { rectangle };