const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");
const { getAlignmentByFather } = require("./util/alignment_by_father");

class ImageWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart(child) {
        const alignment = child != null ? getAlignmentByFather(child, this, true) : '';
        let childWidget = child != null ? `child:${child.toDart()},` : ``;
        return `Container(
            ${alignment}
            width: ${this.XdNode.localBounds.width},
            height: ${this.XdNode.localBounds.height},
            color: ${randomColor()},
            ${childWidget}
        )`;
    }
}

exports.ImageWidget = ImageWidget;