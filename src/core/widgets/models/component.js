const { Bounds } = require("../bounds");
const { wrapWithInkWell } = require("./inkwell");

class Component {
    constructor(node, widget) {
        this.node = node;
        const bounds = node.globalBounds;
        let aux = 0.01;
        this.bounds = new Bounds(bounds.x - aux, bounds.x + bounds.width + aux, bounds.y - aux, bounds.y + bounds.height + aux);
        this.widget = widget;
    }

    toDart(child) {
        const node = this.node;
        child = child != null ? `child: ${child.toDart()},` : ``;
        return new XDComponent(node, this.widget).toDart(child);
    }
}

module.exports = {
    Component: Component,
};

class XDComponent {
    constructor(node, widget) {
        this.node = node;
        this.widget = widget;
    }

    toDart(child) {
        if (child != null) { }
        this.widget = wrapWithInkWell(this.node, this.widget);
        return `const ${this.node.name}()`;
    }
}