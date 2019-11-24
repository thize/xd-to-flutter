function rectangleJson(node) {
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
    if (isGradient) {
        var gradient = node.fill;
        gradient["colorStops"].forEach(element => {
            element["opacity"] = element["color"].a / 255 * node.opacity;
            element["color"] = element["color"].toHex(true);
        });
    }
    return JSON.stringify({
        "type": "container",
        "name": node.name,       
        "w": w,
        "h": h,
        "globalW": node.globalBounds["width"],
        "globalH": node.globalBounds["height"],
        "x":  node.globalBounds["x"],
        "y":  node.globalBounds["y"],
        "radius": node.hasRoundedCorners ? node.cornerRadii : null,
        "color": !isGradient ? node.fill.toHex(true) : node.fill,
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

/*
Container(
    height: 200,
    width: 200,
    color: Colors.white,
    decoration: BoxDecoration(
        border: Border.all(width: 50),
        color: Colors.white,
        borderRadius: BorderRadius.circular(80),
        boxShadow: ,
        gradient: ,
        image: ,
        shape: ,
    ),
    alignment: ,
    child: ,
    constraints: ,
    decoration: ,
    foregroundDecoration: ,
)
*/