const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");
const { getAlignmentByFather } = require("./util/alignment_by_father");

class ArtboardWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart(child) {
        let childWidget = child != null ? `body:${getAlignmentByFather(child, this)},` : ``;
        return `Scaffold(
            backgroundColor: ${randomColor()},
            ${childWidget}
        )`;
    }
}

exports.ArtboardWidget = ArtboardWidget;