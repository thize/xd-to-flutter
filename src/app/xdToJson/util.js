function fixDouble(value) {
    if (value == null) return value;
    try {
        return parseFloat(value.toFixed(2));
    } catch (e) {
        return parseFloat((parseFloat(value)).toFixed(2));
    }
}

function getGradient(node) {
    let gradient = node.fill;
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
    return gradient;
}

module.exports = { fixDouble, getGradient };

