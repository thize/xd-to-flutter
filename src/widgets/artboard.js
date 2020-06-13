const { Bounds } = require("../bounds");
const { getAlignmentByFather } = require("./util/alignment_by_father");
const { getGradientParam } = require("./util/gradients");
const xd = require("scenegraph");
const { getColor } = require("./util/color");

class ArtboardWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
    }

    toDart(child) {
        const isFill = this.xdNode.fill instanceof xd.Color;
        const bgColor = isFill ? `backgroundColor: ${getColor(this.xdNode.fill, 1)},` : '';
        let childWidget = '';
        let alignment = '';
        if (isFill) {
            if (child) childWidget = `body:${getAlignmentByFather(child, this)},`;
        } else {
            alignment = child ? getAlignmentByFather(child, this, true) : '';
            if (child) childWidget = `child: ${child.toDart()},`;
            childWidget = `
                body: Container(
                    ${alignment}
                    decoration: BoxDecoration(
                        ${getGradientParam(this.xdNode.fill, 1)}
                    ),
                    ${childWidget}
                ),
                `;
        }
        return `Scaffold(
            ${bgColor}
            ${childWidget}
        )`;
    }
}

exports.ArtboardWidget = ArtboardWidget;