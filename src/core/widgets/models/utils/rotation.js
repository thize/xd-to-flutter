const { getRotation } = require('../../util/util');

function wrapWithRotation(widget, node) {
    const rotation = getRotation(node);
    if (rotation > 0) {
        throw 'Rotation';
        return `Transform.rotate(
            angle: ${rotation} * pi * 180,
            child: ${widget},
          )`;
    }
    return widget;
}

module.exports = {
    wrapWithRotation: wrapWithRotation,
};
 