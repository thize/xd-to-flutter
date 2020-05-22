const { fillToColor } = require("./fill_to_color");
const { doubleWithTag } = require("./double_with_tag");
const { simpleCode } = require("../../util/util");

function shadow(node) {
    const shadow = node.shadow;
    const x = shadow.x;
    const y = shadow.y;
    const color = fillToColor(shadow.color, node);
    const blurRadius = shadow.blur;
    return `Shadow(${doubleWithTag('blurRadius', blurRadius)}color: ${color},offset: Offset(${simpleCode(x)},${simpleCode(y)}),),`;
}

module.exports = {
    shadow: shadow,
};