const { fixDouble } = require("../util");
const { shadow, border } = require("./util");

function image(node) {
    const json = JSON.parse(`
    { 
        "type": "image",
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
        "radius": ${node.hasRoundedCorners ? JSON.stringify(node.cornerRadii) : null},
        "mimeType": "${ node.fill.mimeType.replace("image/", "")}"
    }`);
    return JSON.stringify(json);
}


module.exports = { image };