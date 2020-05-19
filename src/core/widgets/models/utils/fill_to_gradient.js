const { fixDouble } = require("./fix_double");
const { fillToColor } = require("./fill_to_color");
const { doubleWithTag } = require("./double_with_tag");
const { alignment } = require("./alignment");

function fillToGradient(fill) {
    const isRadial = fill.startR != null;
    if (isRadial) return radialGradient(fill);
    return linearGradient(fill);
}

module.exports = {
    fillToGradient: fillToGradient,
};

function radialGradient(fill) {
    const centerAlignment = `center: ${alignment(fill.startX, fill.startY)},`;
    const colors = getColors(fill.colorStops);
    const radius = doubleWithTag('radius', fill.endR);
    const stops = getStops(fill.colorStops);
    return `RadialGradient(${centerAlignment}${radius}${colors}${stops}${getTransformParam(fill)})`;
}

function linearGradient(fill) {
    const beginAlignment = `begin: ${alignment(fill.startX, fill.startY)},`;
    const endAlignment = `end: ${alignment(fill.endX, fill.endY)},`;
    const colors = getColors(fill.colorStops);
    const stops = getStops(fill.colorStops);
    return `LinearGradient(${beginAlignment}${endAlignment}${colors}${stops})`;
}



function getStops(colorStops) {
    const stopList = [];
    colorStops.forEach(colorStop => {
        stopList.push(fixDouble(colorStop.stop));
    });
    const distances = new Set();
    for (let i = 0; i < stopList.length - 1; i++) {
        const dist = Math.abs(stopList[i] - stopList[i + 1]);
        distances.add(dist);
    }
    /// If distances.size == 1, no need stops, all distances are the same
    if (stopList.length == 2 || distances.size == 1)
        return ``;
    return `stops: [${stopList}],`
}

function getColors(colorStops) {
    const colors = [];
    colorStops.forEach(colorStop => {
        colors.push(fillToColor(colorStop.color));
    });
    return `colors: [${colors},],`;
}

function getTransformParam(fill) {
    // The GradientXDTransform is needed even if there is no transformation in order to fix the aspect ratio.
    let o = fill.gradientTransform;
    return 'transform: GradientXDTransform(' +
        `${o.a}, ${o.b}, ${o.c}, ` +
        `${o.d}, ${o.e}, ${o.f}, ` +
        `${alignment(fill.startX, fill.startY)}), `;
}