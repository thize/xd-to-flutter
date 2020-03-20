const { fillToColor } = require("./fill_to_color");
const { doubleWithTag } = require("./double_with_tag");

function shadow(node) {
    const shadow = node.shadow;
    const x = shadow.x;
    const y = shadow.y;
    const color = fillToColor(shadow.color);
    const blurRadius = shadow.blur;
    return `Shadow(${doubleWithTag('blurRadius', blurRadius)}color: ${color},offset: Offset(${x},${y}),),`;
}

module.exports = {
    shadow: shadow,
};