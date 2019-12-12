const { fixDouble } = require("../util");
const { shadow, border } = require("./util");

function text(node) {
    let name = node.name;
    if (name.length >= 10) {
        name = name.substring(0, 10);
    }
    const json = JSON.parse(`
    { 
        "type": "text",
        "name": "${name}",
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
        "withAreaBox": ${node.areaBox != null},
        "color": "${node.fill.toHex(true)}",
        "textAlign": "${node.textAlign}",
        "underline": ${node.underline},
        "strikethrough": ${node.strikethrough},
        "fontFamily": "${node.fontFamily}",
        "fontWeight": "${node.fontStyle.toLowerCase().replace("-", "")}",
        "fontSize": ${node.fontSize}
    }`);
    return JSON.stringify(json);
};

module.exports = { text };