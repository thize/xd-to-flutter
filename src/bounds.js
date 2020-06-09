class Bounds {
    /**
    * @param {Node} node
    * @param {number} x1
    * @param {number} x2
    * @param {number} y1
    * @param {number} y2
    */
    constructor(node, parentBouds, x1, x2, y1, y2) {
        if (!node && !parentBouds) {
            this.x1 = x1
            this.x2 = x2;
            this.y1 = y1;
            this.y2 = y2;
        } else if (!node) {
            this.x1 = parentBouds.x1
            this.x2 = parentBouds.x2;
            this.y1 = parentBouds.y1;
            this.y2 = parentBouds.y2;
        } else {
            this.x1 = node.globalBounds.x;
            this.x2 = this.x1 + node.globalBounds.width;
            this.y1 = node.globalBounds.y;
            this.y2 = this.y1 + node.globalBounds.height;
        }
    }
}

exports.Bounds = Bounds;