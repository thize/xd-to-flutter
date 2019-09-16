function color(color2, opacityValue) {
    return `Color(${color2.replace("#", "0xff")})${opacity(opacityValue)}`;
}

function opacity(value) {
    return value == '1.0' ? ',' : `.withOpacity(${value.toFixed(2)}),`;
}

function allOpacity(opacity1, opacity2) {
    return (opacity1 + opacity2) / 2;
}

function offSet(json) {
    return `Offset(sz(${json["shadow"]["x"].toFixed(2)}),sz(${json["shadow"]["y"].toFixed(2)}))`;
}

module.exports = { color, offSet, allOpacity };



