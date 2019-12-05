function export_color(node) {
    let json = {
        "color": node.fill["value"] != null ? node.fill.toHex(true) : node.fill,
        "colorOpacity": node.fill["value"] == null ? 1.0 : node.fill.a / 255,
        "opacity": node.opacity,
    };
    let opacity = parseFloat((json["colorOpacity"] * json["opacity"]).toFixed(2));
    let hexColor = json["color"];
    if (opacity == 0) return "Colors.transparent";
    return `Color(${hexColor.replace("#", "0xff")})${opacity != 1 ? `.withOpacity(${opacity})` : ""}`;
}

module.exports = { export_color };