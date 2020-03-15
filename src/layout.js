const { Bounds } = require("./models/bounds");
const { Children } = require("./models/widgets/children");
/**
* Create full layout
* 
* @param {[any]} widgets list of all selection widgets
* @return {Layout} Layout class
*/
function generateLayout(widgets) {
    return new Layout(widgets);
}

module.exports = {
    generateLayout: generateLayout,
};


class Layout {
    /**
    * @param {[any]} widgets list of all selection widgets
    */
    constructor(widgets) {
        this.no = new No(widgets[0]);
        for (let i = 1; i < widgets.length; i++) {
            const widget = widgets[i];
            this.no = insertNoIn(new No(widget), this.no);
        }
    }

    toDart() {
        return this.no.toDart();
    }
}

class No {
    /**
    * @param {[any]} widgets list of all selection widgets
    * @param {No} father Father No
    * @param {string} type (Column, Row or Stack)
    */
    constructor(widget, father, type) {
        this.widget = widget;
        this.father = father;
        this.type = type == null ? widget.node.name : type;
        this.children = [];
        this.bounds;
        this.updateBounds();
    }

    /**
    * @return {Bounds} No bounds
    */
    updateBounds() {
        if (this.widget != null) {
            const widgetBounds = this.widget.bounds;
            this.bounds = new Bounds(widgetBounds.x1, widgetBounds.x2, widgetBounds.y1, widgetBounds.y2);
        } else {
            if (this.children.length > 0) {
                const thisBounds = this.children[0].bounds;
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

    toDart() {
        if (this.widget == null) this.widget = new Children(this.type, this);
        return this.widget.toDart();
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
        console.log(`${tabs}${this.type}${children}`);
    }
}

/**
* Insert new No to the Tree
* 
* @param {No} newNo No to be inserted
* @param {No} inNo Actual Tree's No
* @return {No} inNo or new Tree head
* 
* this function check relation between nodes
* and insert the new No in the tree 
*/
function insertNoIn(newNo, inNo) {
    inNo.updateBounds();
    const nodesRelation = relation(newNo, inNo);
    if (nodesRelation == 'inside' || (nodesRelation == 'above' && (inNo.type == 'Row' || inNo.type == 'Column'))) {
        return insertInside(newNo, inNo);
    } else if (nodesRelation == 'above') {
        return wrapNodesWithType([inNo, newNo], 'Stack');
    } else if (nodesRelation == 'outside') {
        const better = betterOutside(newNo, inNo);
        return wrapNodesWithType([inNo, newNo], better);
    }
    return inNo;
}

/**
* Insert new No inside No
* 
* @param {No} newNo No to be inserted
* @param {No} inNo Actual Tree's No
*/
function insertInside(newNo, inNo) {
    if (inNo.children.length == 0) {
        inNo.children.push(newNo);
        newNo.father = inNo;
        inNo.updateBounds();
        return inNo;
    } else {
        const invertedType = inNo.type == `Row` ? `Column` : inNo.type == `Column` ? `Row` : ``;
        let insertPosition;
        let qtdAboves = 0;
        for (let i = 0; i < inNo.children.length; i++) {
            const child = inNo.children[i];
            const nodesRelation = relation(newNo, child);
            if (nodesRelation == 'inside' || nodesRelation == 'above' || betterOutside(newNo, child) == invertedType) {
                if (nodesRelation == 'above') {
                    qtdAboves++;
                }
                insertPosition = i;
            }
        }
        if (qtdAboves > 1) {
            return wrapNodesWithType([inNo, newNo], `Stack`);
        } else if (insertPosition != null && qtdAboves < 2) {
            inNo.children[insertPosition] = insertNoIn(newNo, inNo.children[insertPosition]);
            inNo.updateBounds();
            return inNo;
        }
        inNo.children[0] = insertNoIn(newNo, inNo.children[0]);
        inNo.updateBounds();
        return inNo;
    }
}

/**
* Check relation between two nodes
* 
* @param {No} node1 The First Node
* @param {No} node2 The Second Node
* @returns {string} (inside, outside or above);
*/
function relation(node1, node2) {
    const node1Bounds = node1.bounds;
    const node2Bounds = node2.bounds;
    const boundsX1 = node1Bounds.x1 <= node2Bounds.x1 ? node1Bounds : node2Bounds;
    const boundsX2 = node1Bounds.x1 <= node2Bounds.x1 ? node2Bounds : node1Bounds;
    const boundsY1 = node1Bounds.y1 <= node2Bounds.y1 ? node1Bounds : node2Bounds;
    const boundsY2 = node1Bounds.y1 <= node2Bounds.y1 ? node2Bounds : node1Bounds;
    const canBeInsideX = boundsX1.x2 >= boundsX2.x2;
    const canBeInsideY = boundsY1.y2 >= boundsY2.y2;
    if (canBeInsideX && canBeInsideY) return 'inside';
    const insideX = boundsX1.x2 > boundsX2.x1;
    const insideY = boundsY1.y2 > boundsY2.y1;
    if ((canBeInsideY && insideX) || (canBeInsideX && insideY) || (insideX && insideY)) return 'above';
    return 'outside';
}

/**
* Wrap node with children node type
* 
* @param {[No]} nodes AllNodes
* @param {string} wrapperType Wrapper type (Column, Row or Stack)
* @return {No} wrapperNo, ex: oldNode = wrapNodesWithType(...);
*/
function wrapNodesWithType(nodes, wrapperType) {
    const first = nodes[0];
    const father = first.father;
    const fatherType = father != null ? father.type : null;
    if (first.type == wrapperType) {
        first.children.push(nodes[1]);
        nodes[1].father = first;
        first.children = sortNodesByType(wrapperType, first.children);
        first.updateBounds();
        return first;
    } else if (fatherType == wrapperType) {
        father.children.push(nodes[1]);
        nodes[1].father = first;
        father.children = sortNodesByType(wrapperType, father.children);
        father.updateBounds();
        return first;
    }
    const wrapperNo = new No(null, father, wrapperType);
    nodes.forEach(node => {
        node.father = wrapperNo;
        wrapperNo.children.push(node);
    });
    wrapperNo.children = sortNodesByType(wrapperType, wrapperNo.children);
    wrapperNo.updateBounds();
    return wrapperNo;
}

/**
* @param {string} sortType (Row, Column or Stack)
* @param {[No]} nodes nodes to be ordered
* @returns {[No]} ordered nodes
*/
function sortNodesByType(sortType, nodes) {
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
* @param {No} newNo
* @param {No} inNo
* @returns {string} better type (Row or Column)
*/
function betterOutside(newNo, inNo) {
    let node1Bounds = newNo.bounds;
    let node2Bounds = inNo.bounds;
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
