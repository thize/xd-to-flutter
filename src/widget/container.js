class Container {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.x1 = bounds.x;
        this.x2 = this.x1 + bounds.width;
        this.y1 = bounds.y;
        this.y2 = this.x2 + bounds.height;
    }

    toDart() {
        let node = this.node;
        return new XDRectangle(node).toDart();
    }
}

module.exports = {
    Container: Container,
};