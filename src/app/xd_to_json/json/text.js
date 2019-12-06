const { fixDouble } = require("../util");
const { shadow, border } = require("./util");

function text(node) {    
    const json = JSON.parse(`
    { 
        "type": "text",
        "name": "${node.name}",
        "x": ${fixDouble(node.globalBounds.x)},
        "y": ${fixDouble(node.globalBounds.y)},
        "w": ${fixDouble(node.localBounds.width)},
        "h": ${fixDouble(node.localBounds.height)},
        "gbW": ${fixDouble(node.globalBounds.width)},
        "gbH": ${fixDouble(node.globalBounds.height)},
        "rotation": ${fixDouble(node.rotation)},
        "opacity": ${fixDouble((node.fillEnabled ? node.fill.a / 255 : 1) * node.opacity)},
        "blend": null,
        "shadow": ${node.shadow == null || !node.shadow.visible ? null : shadow(node)},
        "text": "${node.text.replace(new RegExp("\n", 'g'), "\\n")}",
        "border": ${node.strokeEnabled ? border(node) : null},
        "withAreaBox": ${node.areaBox != null}
    }`);
    return JSON.stringify(json);
};

module.exports = { text };