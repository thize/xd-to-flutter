const { Bounds } = require("../bounds");
const { widgetPrefix } = require("../../functions/util/util");

class Component {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.bounds = new Bounds(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    }

    toDart() {
        const node = this.node;
        return new XDComponent(node).toDart();
    }
}

module.exports = {
    Component: Component,
};

class XDComponent {
    constructor(node) {
        this.node = node;
    }

    toDart() {
        return `const ${widgetPrefix()}${this.node.name}()`;
    }
}