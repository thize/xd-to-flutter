const { Bounds } = require("../bounds");

class MaskWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart() {
        // const { itemsToDart } = require("../items_to_dart");
        // const { removeItemsFromGroup } = require("../util");
        // const ungroupedItems = removeItemsFromGroup(this.XdNode.children);
        // const itemsDart = itemsToDart(ungroupedItems);
        return `
        Container(
            // [${this.XdNode.name}] Group masks aren't supported.
            width: ${this.XdNode.localBounds.width},
            height: ${this.XdNode.localBounds.height},
            color: Colors.red,
        )`;
    }
}

exports.MaskWidget = MaskWidget;