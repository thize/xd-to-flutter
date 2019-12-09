const { fixDouble } = require("../util");
const { shadow, border } = require("./util");

//TODO: Better line JSON
function line(node) {
    const json = JSON.parse(`
    { 
        "type": "line",
        "name": "${node.name}",
        "x": ${fixDouble(node.globalBounds["x"])},
        "y": ${fixDouble(node.globalBounds["y"])},
        "w": ${fixDouble(node.localBounds.width)},
        "h": ${fixDouble(node.localBounds.height)},
        "gbW": ${fixDouble(node.globalBounds.width)},
        "gbH": ${fixDouble(node.globalBounds.height)},
        "rotation": ${fixDouble(node.rotation)},
        "opacity": ${fixDouble(node.opacity)},
        "blend": null,
        "border": ${node.strokeEnabled ? border(node) : null},
        "shadow": ${node.shadow == null || !node.shadow.visible ? null : shadow(node)},
        "color": "${node.stroke.toHex(true)}"
    }`);
    return JSON.stringify(json);
}

module.exports = { line };