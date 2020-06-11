const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");
const { getAlignmentByFather } = require("./util/alignment_by_father");

class ImageWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
    }

    toDart(child) {
        const alignment = child != null ? getAlignmentByFather(child, this, true) : '';
        let childWidget = child != null ? `child:${child.toDart()},` : ``;
        return `Container(
            ${alignment}
            width: ${this.xdNode.localBounds.width},
            height: ${this.xdNode.localBounds.height},
            color: ${randomColor()},
            ${childWidget}
        )`;
    }
}

exports.ImageWidget = ImageWidget;