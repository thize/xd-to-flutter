const { Bounds } = require("../bounds");
const { sz, tab } = require("../../utils");

class Container {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.bounds = new Bounds(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    }

    toDart(depth, child) {
        let node = this.node;
        child = child != null ? `${tab(depth + 1)}child:${child.toDart(depth + 1)},` : ``;
        let dartCode = `${node.constructor.name}(\n${tab(depth + 1)}width:${sz(this.bounds.x2 - this.bounds.x1, true)},${tab(depth + 1)}height:${sz(this.bounds.y2 - this.bounds.y1, false)},${child}${tab(depth)})`;
        // let dartCode = `${node.constructor.name}(width:${sz(this.bounds.x2 - this.bounds.x1, true)},height:${sz(this.bounds.y2 - this.bounds.y1, false)},${child})`;
        return dartCode;
    }
}

module.exports = {
    Container: Container,
};