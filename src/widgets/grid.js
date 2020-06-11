const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");

class GridWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart() {
        return `
        Container(
            // [${this.XdNode.name}] Repeat grid aren't supported.
            width: ${this.XdNode.localBounds.width},
            height: ${this.XdNode.localBounds.height},
            color: Colors.red,
        )`;
    }

}

exports.GridWidget = GridWidget;