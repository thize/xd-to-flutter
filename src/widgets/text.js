const { randomColor } = require("./util/util");
const { Bounds } = require("../bounds");

class TextWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart(child) {
        let childWidget = child != null ? `child:${child.toDart()},` : ``;
        return `Container(
            alignment: Alignment.center,
            width: ${this.XdNode.localBounds.width},
            height: ${this.XdNode.localBounds.height},
            color: ${randomColor()},
            ${childWidget}
        )`;
    }

}

exports.TextWidget = TextWidget;