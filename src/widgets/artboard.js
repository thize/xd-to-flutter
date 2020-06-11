const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");
const { xdAlignmentToDartAlignment } = require("./util/xd_alignment_to_dart_alignment");

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


function getAlignmentByFather(node, fatherNode) {
    const top = node.bounds.y1 - fatherNode.bounds.y1;
    const right = fatherNode.bounds.x2 - node.bounds.x2;
    const bot = fatherNode.bounds.y2 - node.bounds.y2;
    const left = node.bounds.x1 - fatherNode.bounds.x1;
    let auxBot = bot == 0 && top == 0 ? 1 : bot;
    const alignY = (top / (top + auxBot));
    let auxRight = right == 0 && left == 0 ? 1 : right;
    const alignX = (left / (left + auxRight));
    const resAlignment = xdAlignmentToDartAlignment(alignX, alignY);
    if (resAlignment == 'Alignment.center')
        return `Center(child: ${node.toDart()},)`;
    if (resAlignment != 'Alignment.topLeft') {
        return `Align(alignment: ${resAlignment}, child: ${node.toDart()},)`;
    }
    return node.toDart();
}