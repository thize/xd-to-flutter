function rectangleJson(node) {
    if (node.constructor.name == 'Line') {
        const horizontal = node.globalBounds['width'] >= node.globalBounds['height'];
        let w = horizontal ? node.globalBounds['width'] : node.strokeWidth;
        let h = !horizontal ? node.globalBounds['height'] : node.strokeWidth;
        const withRadius = node.strokeEndCaps == 'round';
        const radius = Math.min(w, h) / 2;
        return JSON.stringify({
            "type": "container",
            "name": node.name,
            "w": w,
            "h": h,
            "globalW": node.globalBounds["width"],
            "globalH": node.globalBounds["height"],
            "rotation": node.rotation,
            "x": node.globalBounds["x"],
            "y": node.globalBounds["y"],
            "radius": withRadius ? { "topLeft": radius, "topRight": radius, "bottomRight": radius, "bottomLeft": radius } : null,
            "color": node.stroke.toHex(true),
            "wcolor": node.strokeEnabled,
            "image": false,
            "borderColor": "#ffffff",
            "borderOpacity": 0,
            "borderWidth": 0,
            "withBorder": false,
            "opacity": node.stroke.a / 255 * node.opacity,
            "shadow": node.shadow == null ? { "visible": false } : {
                "x": node.shadow["x"],
                "y": node.shadow["y"],
                "color": node.shadow["color"].toHex(true),
                "opacity": (color ? node.shadow["color"].a / 255 : 1) * node.opacity,
                "visible": node.shadow["visible"],
                "blur": node.shadow.blur
            },
            "shape": 'rectangle'
        });
    }
    var w, h, shape = "rectangle";
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
    }
    var image = false;
    try {
        image = node.fill.mimeType.includes("image");
    } catch (error) {
    }
    var color = node.constructor.name != "Artboard";
    var isGradient = node.fill["value"] == null;
    var gradient = node.fill;
    if (isGradient) {
        let gradients = [];
        for (let i = 0; i < gradient["colorStops"].length; i++) {
            let stop = gradient["colorStops"][i];
            gradients.push({ "color": stop["color"].toHex(true), "stop": stop["stop"], "opacity": stop["color"].a / 255 * node.opacity });
        }
        let isLinear = gradient["endR"] == undefined;
        if (isLinear) {
            gradient = { "endY": gradient["endY"], "endX": gradient["endX"], "startY": gradient["startY"], "startX": gradient["startX"], "colorStops": gradients };
        } else {
            let startX = (gradient["startX"] - 0.5) * 2;
            let startY = (gradient["startY"] - 0.5) * 2;
            gradient = { "gradientTransform": gradient["gradientTransform"], "endR": gradient["endR"], "startR": gradient["startR"], "endY": gradient["endY"], "endX": gradient["endX"], "startY": startY, "startX": startX, "colorStops": gradients };
        }
    }
    console.log(`ate aq blz2`);
    return JSON.stringify({
        "type": "container",
        "name": node.name,
        "w": w,
        "h": h,
        "globalW": node.globalBounds["width"],
        "globalH": node.globalBounds["height"],
        "rotation": node.rotation,
        "x": node.globalBounds["x"],
        "y": node.globalBounds["y"],
        "radius": node.hasRoundedCorners ? node.cornerRadii : null,
        "color": isGradient ? gradient : node.fill.toHex(true),
        "wcolor": node.fillEnabled,
        "image": image,
        "borderColor": color ? node.stroke.toHex(true) : "#ffffff",
        "borderOpacity": (color && !image ? node.stroke.a / 255 : 1) * node.opacity,
        "borderWidth": node.strokeWidth,
        "withBorder": node.strokeEnabled,
        "opacity": (color && !image && !isGradient ? node.fill.a / 255 : 1) * node.opacity,
        "shadow": node.shadow == null ? { "visible": false } : {
            "x": node.shadow["x"],
            "y": node.shadow["y"],
            "color": node.shadow["color"].toHex(true),
            "opacity": (color ? node.shadow["color"].a / 255 : 1) * node.opacity,
            "visible": node.shadow["visible"],
            "blur": node.shadow.blur
        },
        "shape": shape
    });
}

module.exports = { rectangleJson };