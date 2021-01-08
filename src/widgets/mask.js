const { Bounds } = require("../bounds");

class MaskWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
    }

    toDart() {
        // const { itemsToDart } = require("../items_to_dart");
        // const { removeItemsFromGroup } = require("../util");
        // const ungroupedItems = removeItemsFromGroup(this.xdNode.children);
        // const itemsDart = itemsToDart(ungroupedItems);
        let withStyledWidget = document.querySelector('input[name="simpleType"]');
        withStyledWidget = withStyledWidget != null ? withStyledWidget.checked : null;
        if (withStyledWidget) {
            return `Container(
            // [${this.xdNode.name}] Group masks aren't supported.
        ).w(${this.xdNode.localBounds.width}).h(${this.xdNode.localBounds.height}).bgColor(Colors.red)`;
        }
        return `
        Container(
            // [${this.xdNode.name}] Group masks aren't supported.
            width: ${this.xdNode.localBounds.width},
            height: ${this.xdNode.localBounds.height},
            color: Colors.red,
        )`;
    }
}

exports.MaskWidget = MaskWidget;