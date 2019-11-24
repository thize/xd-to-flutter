function svgJson(node) {
    return JSON.stringify({
        "type": "svg",
        "name": node.name.replace("svg_", ""),
        "w": node.globalBounds["width"],
        "h": node.globalBounds["height"],
        "globalW": node.globalBounds["width"],
        "globalH": node.globalBounds["height"],
        "x": node.globalBounds["x"],
        "y": node.globalBounds["y"],
    });
}

module.exports = { svgJson };