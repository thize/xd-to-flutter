const { Bounds } = require("../bounds");

class GroupWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
    }

    toDart() {
        const { itemsToDart } = require("../items_to_dart");
        const { removeItemsFromGroup } = require("../util");
        const ungroupedItems = removeItemsFromGroup(this.xdNode.children);
        const itemsDart = itemsToDart(ungroupedItems);
        return `\n// Group: ${this.xdNode.name}\n${itemsDart}`;
        /*
        return `
        Container(
            // Group: ${this.xdNode.name}
            width: ${this.xdNode.localBounds.width},
            height: ${this.xdNode.localBounds.height},
            child: ${itemsDart},
        )`;
        */
    }
}

exports.GroupWidget = GroupWidget;