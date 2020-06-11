const { Bounds } = require("../bounds");

class GridWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
    }

    toDart() {
        return `
        Container(
            // [${this.xdNode.name}] Repeat grid aren't supported.
            width: ${this.xdNode.localBounds.width},
            height: ${this.xdNode.localBounds.height},
            color: Colors.red,
        )`;
    }

}

exports.GridWidget = GridWidget;