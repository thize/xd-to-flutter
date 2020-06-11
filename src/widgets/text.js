const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");

class TextWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart() {
        return `Container(
            width: ${this.XdNode.localBounds.width},
            height: ${this.XdNode.localBounds.height},
            color: ${randomColor()},
        )`;
    }

}

exports.TextWidget = TextWidget;