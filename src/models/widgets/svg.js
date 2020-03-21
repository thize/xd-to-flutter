const { Bounds } = require("../bounds");
const { width, height } = require("./utils/width_height");

class Svg {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.bounds = new Bounds(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    }

    toDart() {


        let node = this.node;
        return new XDSvg(node).toDart();
    }
}

module.exports = {
    Svg: Svg,
};

class XDSvg {
    constructor(node) {
        this.node = node;
    }

    toDart() {
        const node = this.node;
        return `Container(
            ${height(node)}${width(node)}
            color: Colors.red,
        )`;
    }
}