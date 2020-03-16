const { Bounds } = require("../bounds");
const { sz } = require("../../utils");

class Container {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.bounds = new Bounds(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    }

    toDart(child) {
        let node = this.node;
        child = child != null ? `child: ${child.toDart()},` : ``;
        return `${node.constructor.name}(
            width: ${sz(this.bounds.x2 - this.bounds.x1, true)},
            height: ${sz(this.bounds.y2 - this.bounds.y1, false)},
            ${child}
        )`;
    }
}

module.exports = {
    Container: Container,
};