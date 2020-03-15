class Children {
    /**
    * @param {string} type (Column, Row or Stack)
    * @param {No} node
    */
    constructor(type, node) {
        this.type = type;
        this.node = node;
    }

    toDart() {
        let widgets = [];
        this.node.children.forEach(child => {
            widgets.push(child.toDart());
        });
        // this.updateBounds();
        const bounds = this.node.bounds;
        return `${this.type}(
            height: ${bounds.y2 - bounds.y1},
            width: ${bounds.x2 - bounds.x1},
            children: [
                ${widgets},
            ],
        )`;
    }

    updateBounds() {
        if (this.node.father != null) {
            const type = this.type;
            if (type == `Column` || type == `Stack`) {
                this.node.bounds.y1 = this.node.father.bounds.y1;
                this.node.bounds.y2 = this.node.father.bounds.y2;
            }
            if (type == `Row` || type == `Stack`) {
                this.node.bounds.x1 = this.node.father.bounds.x1;
                this.node.bounds.x2 = this.node.father.bounds.x2;
            }
        }
    }
}

module.exports = {
    Children: Children,
};