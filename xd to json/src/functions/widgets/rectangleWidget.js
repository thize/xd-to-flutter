function rectangleWidget(json) {
    return JSON.stringify({
        "type": "container",
        "name": node.name,
        "w": w,
        "h": h,
        "x": artboard ? 0 : node.globalBounds["x"],
        "y": artboard ? 0 : node.globalBounds["y"],
        "radius": node.hasRoundedCorners ? node.cornerRadii : null,
        "color": node.fill["value"] != null ? node.fill.toHex(true) : node.fill,
        "image": image,
        "borderColor": node.stroke.toHex(true),
        "borderWidth": node.strokeWidth,
        "withBorder": node.strokeEnabled,
        "opacity": (color ? node.fill.a / 255 : 1) * node.opacity,
        "shadow": node.shadow == null ? { "visible": false } : {
            "x": node.shadow["x"],
            "y": node.shadow["y"],
            "color": node.shadow["color"].toHex(true),
            "opacity": (color ? node.fill.a / 255 : 1) * node.opacity,
            "visible": node.shadow["visible"]
        },
        "shape": shape
    });
}


module.exports = { rectangleWidget };