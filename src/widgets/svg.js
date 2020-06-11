const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");

class SvgWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
    }

    toDart() {
        return `Container(
            width: ${this.xdNode.localBounds.width},
            height: ${this.xdNode.localBounds.height},
            color: ${randomColor()},
        )`;
    }

}

exports.SvgWidget = SvgWidget;