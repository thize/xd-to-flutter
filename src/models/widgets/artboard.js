const { Bounds } = require("../bounds");
const { fillToColor } = require("./utils/fill_to_color");
const { fillToGradient } = require("./utils/fill_to_gradient");

class Artboard {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.bounds = new Bounds(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    }

    async toDart(child) {
        let node = this.node;
        const dartCode = await new XDArtboard(node).toDart(child);
        return dartCode;
    }
}

module.exports = {
    Artboard: Artboard,
};

class XDArtboard {
    constructor(node) {
        this.node = node;
    }

    async toDart(child) {
        const hasGradient = this.gradient() != '';
        if (hasGradient) {
            child = child != null ? `child:${await child.toDart()},` : ``;
            const gradient = this.gradient(child);
            return `Scaffold(${gradient})`;
        }
        child = child != null ? `body: Center(child: ${await child.toDart()},),` : ``;
        const fill = `${this.color()}`;
        return `Scaffold(${fill}${child})`;
    }

    gradient(child) {
        const node = this.node;
        if (node.fillEnabled && node.fill.startX != null) {
            return `body: Container(alignment: Alignment.center, decoration: BoxDecoration(gradient: ${fillToGradient(node.fill)},),${child}),`;
        }
        return '';
    }

    color() {
        const node = this.node;
        if (!node.fillEnabled) return '';
        const color = fillToColor(node.fill);
        return `backgroundColor: ${color},`;
    }
}


