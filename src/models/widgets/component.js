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

    async toDart(child, isFirst) {
        const node = this.node;
        child = child != null ? `child: ${await child.toDart()},` : ``;
        return await new XDComponent(node, this.widget).toDart(child, isFirst);
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

    async toDart(child, isFirst) {
        if (child != null) { }
        if (isFirst) {
            return wrapWithInkWell(this.node, this.widget.substr(0, this.widget.length - 1));

        }
        this.widget = wrapWithInkWell(this.node, this.widget);
        return `const ${this.node.name}()`;
    }
}