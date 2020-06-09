const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");

class SvgWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart() {
        return `Container(
            alignment: Alignment.center,
            width: ${this.XdNode.localBounds.width},
            height: ${this.XdNode.localBounds.height},
            color: ${randomColor()},
        )`;
    }

}

exports.SvgWidget = SvgWidget;