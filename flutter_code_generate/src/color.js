function generateColor(node) {
    let json = {
        "color": node.fill["value"] != null ? node.fill.toHex(true) : node.fill,
        "colorOpacity": node.fill["value"] == null ? 1.0 : node.fill.a / 255,
        "opacity": node.opacity,
    };
    let opacity = json["colorOpacity"] * json["opacity"];
    let hexColor = json["color"];
    console.log(`opacity = ${opacity}`);
    opacity = parseFloat(opacity.toFixed(2));
    return `Color(${hexColor.replace("#", "0xff")})${opacity != 1 ? `.withOpacity(${opacity})` : ""}`;
}

module.exports = { generateColor };
