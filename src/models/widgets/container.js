const { Bounds } = require("../bounds");

class Container {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.bounds = new Bounds(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    }

    toDart() {
        let node = this.node;
        return `${node.constructor.name}(
            width: ${this.bounds.x2 - this.bounds.x1},
            height: ${this.bounds.y2 - this.bounds.y1},
        )`;
    }
}

module.exports = {
    Container: Container,
};