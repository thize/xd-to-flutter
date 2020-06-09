const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");

class ArtboardWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart(child) {
        let childWidget = child != null ? `child:${child.toDart()},` : ``;
        return `Scaffold(
            backgroundColor: ${randomColor()},
            ${childWidget}
        )`;
    }

}

exports.ArtboardWidget = ArtboardWidget;