/*
Copyright 2020 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/

const { xdItemToWidget, widgetCanHaveChild, removeItemsFromGroup, fixAllNumbers, putSimpleCode } = require("./util");
const { Bounds } = require("./bounds");
const { Children } = require("./widgets/children");
const { ArtboardWidget } = require("./widgets/artboard");
const { wrapWithInkWell, wrapWithRotation } = require("./widgets/util/widgets_util");
const { ComponentWidget } = require("./widgets/component");
const { formatDart } = require("./widgets/util/format_dart");

function itemsToDart(items, isFirst = false) {
    const ungroupedItems = removeItemsFromGroup(items);
    const widgets = generateWidgetsFromItems(ungroupedItems);
    const tree = new Tree(widgets, isFirst);
    return tree.toDart();
}

exports.itemsToDart = itemsToDart;

function generateWidgetsFromItems(items) {
    const widgets = [];
    items.forEach(item => {
        widgets.push(xdItemToWidget(item));
    });
    return widgets;
}


class Tree {
    /**
    * @param {[any]} widgets list of all selection widgets
    */
    constructor(widgets, isFirst) {
        this.node = new Node(widgets[0]);
        for (let i = 1; i < widgets.length; i++) {
            const widget = widgets[i];
            this.node = this.insertNodeIn(new Node(widget), this.node);
        }
        this.isFirst = isFirst;
        // console.log(this.node.debug(0));
    }

    toDart() {
        let widget = this.node.toDart();
        if (this.isFirst) {
            widget = formatDart(widget + ';');
            return putSimpleCode(widget);
        }
        return widget;
    }


    /**
    * Insert new Node to the Tree
    * 
    * @param {Node} newNode Node to be inserted
    * @param {Node} inNode Actual Tree's Node
    * @return {Node} inNode or new Tree head
    * 
    * this function check relation between nodes
    * and insert the new Node in the tree 
    */
    insertNodeIn(newNode, inNode) {
        inNode.updateBounds();
        const nodesRelation = this.relation(newNode, inNode);
        const canInside = widgetCanHaveChild(inNode.widget);
        const inNodeIsArtboard = inNode.widget instanceof ArtboardWidget;
        const inNodeChildIsStack = inNode.children.length > 0 && inNode.children[0].type == 'Stack';
        if ((nodesRelation == 'inside' && canInside && (!inNodeIsArtboard || !inNodeChildIsStack)) || (nodesRelation == 'above' && (inNode.type == 'Row' || inNode.type == 'Column'))) {
            return this.insertInside(newNode, inNode);
        } else if (nodesRelation == 'inside' && inNodeIsArtboard && inNodeChildIsStack) {
            const firstChild = inNode.children[0].children[0];
            const firstChildRelation = this.relation(firstChild, inNode);
            if (firstChildRelation == "above") {
                newNode.father = inNode.children[0];
                inNode.children[0].children.splice(0, 0, newNode);
            } else {
                inNode.children[0].children[0] = this.insertNodeIn(newNode, inNode.children[0].children[0]);
            }
            return inNode;
        } else if (nodesRelation == 'above' || (!canInside && nodesRelation == 'inside')) {
            if (inNodeIsArtboard) {
                return this.insertNodeStackInArtboard(newNode, inNode);
            }
            return this.wrapNodesWithType([inNode, newNode], 'Stack');
        } else if (nodesRelation == 'outside') {
            const better = this.betterOutside(newNode, inNode);
            return this.wrapNodesWithType([inNode, newNode], better);
        }
        return inNode;
    }

    insertNodeStackInArtboard(newNode, inNode) {
        if (inNode.children.length == 0) {
            const stackNode = new Node(null, inNode, 'Stack');
            stackNode.bounds = inNode.bounds;
            inNode.children.push(stackNode);
        }
        const child = inNode.children[0];
        if (child.widget == null && child.type == "Stack") {
            child.children.push(newNode);
            newNode.father = child;
        } else {
            const stackNode = new Node(null, inNode, 'Stack');
            stackNode.bounds = inNode.bounds;
            child.father = stackNode;
            newNode.father = stackNode;
            stackNode.children.push(child);
            stackNode.children.push(newNode);
            inNode.children[0] = stackNode;
        }
        return inNode;
    }

    /**
    * Insert new Node inside Node
    * 
    * @param {Node} newNode Node to be inserted
    * @param {Node} inNode Actual Tree's Node
    */
    insertInside(newNode, inNode) {
        if (inNode.children.length == 0) {
            inNode.children.push(newNode);
            newNode.father = inNode;
            inNode.updateBounds();
            return inNode;
        } else {
            const invertedType = inNode.type == `Row` ? `Column` : inNode.type == `Column` ? `Row` : ``;
            let insertPosition;
            let qtdAboves = 0;
            for (let i = 0; i < inNode.children.length; i++) {
                const child = inNode.children[i];
                const nodesRelation = this.relation(newNode, child);
                if (nodesRelation == 'inside' || nodesRelation == 'above' || this.betterOutside(newNode, child) == invertedType) {
                    if (nodesRelation == 'above') {
                        qtdAboves++;
                    }
                    insertPosition = i;
                }
            }
            if (qtdAboves > 1) {
                return this.wrapNodesWithType([inNode, newNode], `Stack`);
            } else if (insertPosition != null && qtdAboves < 2) {
                inNode.children[insertPosition] = this.insertNodeIn(newNode, inNode.children[insertPosition]);
                inNode.updateBounds();
                return inNode;
            }
            inNode.children[0] = this.insertNodeIn(newNode, inNode.children[0]);
            inNode.updateBounds();
            return inNode;
        }
    }

    /**
    * Check relation between two nodes
    * 
    * @param {Node} node1 The First Node
    * @param {Node} node2 The Second Node
    * @returns {string} (inside, outside or above);
    */
    relation(newNode, inNode) {
        const node1Bounds = inNode.bounds;
        const node2Bounds = newNode.bounds;
        const boundsX1 = node1Bounds.x1 <= node2Bounds.x1 ? node1Bounds : node2Bounds;
        const boundsX2 = node1Bounds.x1 <= node2Bounds.x1 ? node2Bounds : node1Bounds;
        const boundsY1 = node1Bounds.y1 <= node2Bounds.y1 ? node1Bounds : node2Bounds;
        const boundsY2 = node1Bounds.y1 <= node2Bounds.y1 ? node2Bounds : node1Bounds;
        const canBeInsideX = boundsX1.x2 >= boundsX2.x2;
        const canBeInsideY = boundsY1.y2 >= boundsY2.y2;
        if (canBeInsideX && canBeInsideY && boundsX1 == boundsY1) return 'inside';
        const insideX = boundsX1.x2 > boundsX2.x1;
        const insideY = boundsY1.y2 > boundsY2.y1;
        if ((canBeInsideY && insideX) || (canBeInsideX && insideY) || (insideX && insideY)) return 'above';
        return 'outside';
    }

    /**
    * Wrap node with children node type
    * 
    * @param {[Node]} nodes AllNodes
    * @param {string} wrapperType Wrapper type (Column, Row or Stack)
    * @return {Node} wrapperNo, ex: oldNode = wrapNodesWithType(...);
    */
    wrapNodesWithType(nodes, wrapperType) {
        const first = nodes[0];
        const father = first.father;
        const fatherType = father != null ? father.type : null;
        if (first.type == wrapperType) {
            first.children.push(nodes[1]);
            nodes[1].father = first;
            first.children = this.sortNodesByType(wrapperType, first.children);
            first.updateBounds();
            return first;
        } else if (fatherType == wrapperType) {
            father.children.push(nodes[1]);
            nodes[1].father = first;
            father.children = this.sortNodesByType(wrapperType, father.children);
            father.updateBounds();
            return first;
        }
        const wrapperNo = new Node(null, father, wrapperType);
        nodes.forEach(node => {
            node.father = wrapperNo;
            wrapperNo.children.push(node);
        });
        wrapperNo.children = this.sortNodesByType(wrapperType, wrapperNo.children);
        wrapperNo.updateBounds();
        return wrapperNo;
    }

    /**
    * @param {string} sortType (Row, Column or Stack)
    * @param {[Node]} nodes nodes to be ordered
    * @returns {[Node]} ordered nodes
    */
    sortNodesByType(sortType, nodes) {
        if (sortType == 'Row') {
            nodes = nodes.sort((a, b) => a.bounds.x1 - b.bounds.x1);
        } else if (sortType == 'Column') {
            nodes = nodes.sort((a, b) => a.bounds.y1 - b.bounds.y1);
        }
        return nodes;
    }

    /**
    * Select better between Row and Column
    * 
    * @param {Node} newNode
    * @param {Node} inNode
    * @returns {string} better type (Row or Column)
    */
    betterOutside(newNode, inNode) {
        let node1Bounds = newNode.bounds;
        let node2Bounds = inNode.bounds;
        let bounds1 = node1Bounds.x1 <= node2Bounds.x1 ? node1Bounds : node2Bounds;
        let bounds2 = node1Bounds.x1 <= node2Bounds.x1 ? node2Bounds : node1Bounds;
        let xDistance = bounds2.x1 - bounds1.x2;
        bounds1 = node1Bounds.y1 <= node2Bounds.y1 ? node1Bounds : node2Bounds;
        bounds2 = node1Bounds.y1 <= node2Bounds.y1 ? node2Bounds : node1Bounds;
        let yDistance = bounds2.y1 - bounds1.y2;
        if (xDistance < 0) return `Column`;
        if (yDistance < 0) return `Row`;
        return xDistance < yDistance ? 'Column' : 'Row';
    }

}

class Node {
    /**
    * @param {[any]} widgets list of all selection widgets
    * @param {Node} father Father Node
    * @param {string} type (Column, Row or Stack)
    */
    constructor(widget, father, type) {
        this.widget = widget;
        this.father = father;
        this.type = type == null ? widget.xdNode.name : type;
        this.children = [];
        this.bounds;
        this.updateBounds();
    }

    /**
    * @return {Bounds} Node bounds
    */
    updateBounds() {
        if (this.widget != null) {
            const widgetBounds = this.widget.bounds;
            this.bounds = new Bounds(null, widgetBounds);
        } else {
            if (this.children.length > 0) {
                const widgetBounds = this.children[0].bounds;
                const thisBounds = new Bounds(null, widgetBounds);
                this.children.forEach(child => {
                    thisBounds.x1 = Math.min(thisBounds.x1, child.bounds.x1);
                    thisBounds.x2 = Math.max(thisBounds.x2, child.bounds.x2);
                    thisBounds.y1 = Math.min(thisBounds.y1, child.bounds.y1);
                    thisBounds.y2 = Math.max(thisBounds.y2, child.bounds.y2);
                });
                this.bounds = thisBounds;
            }
        }
    }

    /**
    * @param {number} depth depth in the Tree to indent the code
    * @return {string} Generated dart code
    */
    toDart() {
        if (this.widget == null) {
            this.widget = new Children(this.type, this);
        }
        const child = this.children != null ? this.children[0] : null
        const dartWidget = this.widget.toDart(child);
        if (this.widget instanceof ComponentWidget) {
            return dartWidget;
        }
        return fixAllNumbers(wrapWithRotation(this, wrapWithInkWell(this.widget.xdNode, dartWidget)));
    }

    debug(depth) {
        const children = [];
        this.children.forEach(child => {
            children.push(`\n${child.debug(depth + 1)}`);
        });
        let tabs = `| `;
        for (let i = 0; i < depth; i++) {
            tabs += '| ';
        }
        return `${tabs}${this.type}, h = ${this.bounds.y2 - this.bounds.y1}, w = ${this.bounds.x2 - this.bounds.x1} ${children}`;
    }

    isChildren() {
        return this.widget == null || this.widget instanceof Children;
    }
}
exports.Node = Node;