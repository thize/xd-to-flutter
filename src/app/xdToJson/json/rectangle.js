const { fixDouble, getGradient } = require("../util");
const { shadow, border } = require("./util");

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

    const json = JSON.parse(`
    { 
        "type": "rectangle",
        "name": "${node.name}",
        "x": ${fixDouble(node.globalBounds["x"])},
        "y": ${fixDouble(node.globalBounds["y"])},
        "w": ${fixDouble(w)},
        "h": ${fixDouble(h)},
        "gbW": ${fixDouble(node.globalBounds.width)},
        "gbH": ${fixDouble(node.globalBounds.height)},
        "rotation": ${fixDouble(node.rotation)},
        "opacity": ${fixDouble((isGradient ? 1 : (node.fill.a / 255)) * node.opacity)},
        "border": ${node.strokeEnabled ? border(node) : null},
        "shadow": ${node.shadow == null || !node.shadow.visible ? null : shadow(node)},
        "blend": null,
        "color": ${isGradient || !node.fillEnabled ? null : `"${node.fill.toHex(true)}"`},
        "radius": ${node.hasRoundedCorners ? JSON.stringify(node.cornerRadii) : null},
        "shape": "${shape}",
        "gradient": ${isGradient ? gradient : null}
    }`);
    return JSON.stringify(json);
}

module.exports = { rectangle };