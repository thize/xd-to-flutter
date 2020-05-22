const { Bounds } = require("../bounds");
const { withInkWell } = require("../../functions/util/util");

class InkWell {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        let aux = 0.01;
        this.bounds = new Bounds(bounds.x - aux, bounds.x + bounds.width + aux, bounds.y - aux, bounds.y + bounds.height + aux);
    }

    toDart(child) {
        const node = this.node;
        if (withInkWell()) {
            child = child != null ? `child:${child.toDart()},` : ``;
            return new XDInkWell(node).toDart(child);
        }
        return child.toDart();
    }
}

function wrapWithInkWell(node, child) {
    if (withInkWell() && (node.triggeredInteractions[0] != null && node.triggeredInteractions[0].trigger.type == 'tap')) {
        const xdInkWell = new XDInkWell(node);
        return xdInkWell.toDart(`child: ${child},`);
    }
    return child;
}

module.exports = {
    InkWell: InkWell,
    wrapWithInkWell: wrapWithInkWell,
};

class XDInkWell {
    constructor(node) {
        this.node = node;
    }

    toDart(child) {
        return `InkWell(onTap: (){print('onTap ${this.node.name}');},${child})`;
    }
}