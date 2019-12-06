const { fixDouble } = require("../util");

function shadow(node) {
    return `{
        "x": ${node.shadow["x"]},
        "y": ${node.shadow["y"]},
        "color": "${node.shadow["color"].toHex(true)}",
        "opacity": ${ node.shadow["color"].a / 255 * node.opacity},
        "blur": ${node.shadow.blur}
    }`;
}

function border(node) {
    return `{
        "color": "${node.stroke.toHex(true)}",
        "opacity": ${fixDouble(node.stroke.a / 255 * node.opacity)},
        "borderWidth": ${fixDouble(node.strokeWidth)}
    }`;
}

module.exports = { shadow, border };