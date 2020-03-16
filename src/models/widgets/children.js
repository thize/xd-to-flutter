const { sz } = require("../../utils");

class Children {
    /**
    * @param {string} type (Column, Row or Stack)
    * @param {No} node
    */
    constructor(type, node) {
        this.type = type;
        this.node = node;
        this.distances = [];
    }

    toDart() {
        const withSpacer = true;
        this.withSpacer = withSpacer;
        let widgets = [];
        this.updateBounds();
        this.node.children.forEach(child => {
            widgets.push(child.toDart());
        });
        this.updateDistances();
        for (let i = 0, qtd = 0; i < widgets.length; i += 2, qtd++) {
            const distance = this.distanceToDart(this.distances[qtd]);
            if (distance != ``) {
                widgets.splice(i, 0, distance);
            }
        }
        if (withSpacer) {
            const distance = this.distanceToDart(this.distances[this.distances.length - 1]);
            if (distance != ``) {
                widgets.push(distance);
            }
        }
        return `${this.type}(
            children: [
                ${widgets},
            ],
        )`;
    }

    updateBounds() {
        if (this.node.father != null) {
            const type = this.type;
            const fatherType = this.node.father.type;
            const fatherIsChildren = fatherType == 'Column' || fatherType == 'Row' || fatherType == 'Stack';
            if (type == `Column` || type == `Stack` || !fatherIsChildren) {
                this.node.bounds.y1 = this.node.father.bounds.y1;
                this.node.bounds.y2 = this.node.father.bounds.y2;
            }
            if (type == `Row` || type == `Stack` || !fatherIsChildren) {
                this.node.bounds.x1 = this.node.father.bounds.x1;
                this.node.bounds.x2 = this.node.father.bounds.x2;
            }
        }
    }

    updateDistances() {
        this.distances = [];
        let bounds = this.getBounds1(this.node);
        this.distances.push(this.getBounds1(this.node.children[0]) - bounds);
        for (let i = 1; i < this.node.children.length; i++) {
            const child = this.node.children[i];
            const antChild = this.node.children[i - 1];
            this.distances.push(this.getBounds1(child) - this.getBounds2(antChild));
        }
        bounds = this.getBounds2(this.node);
        this.distances.push(bounds - this.getBounds2(this.node.children[this.node.children.length - 1]));
    }

    distanceToDart(distance) {
        if (distance > 0) {
            if (this.withSpacer) {
                return `Spacer(flex: ${Math.round(distance)})`
            }
            const width = this.type == 'Row' ? `width: ${sz(distance, true)}` : ``;
            const height = this.type == 'Column' ? `height: ${sz(distance, false)}` : ``;
            if (width != `` || height != ``) {
                return `SizedBox(${width}${height})`
            }
        }
        return ``;
    }

    getBounds1(no) {
        return (this.type == 'Row' ? no.bounds.x1 : no.bounds.y1);
    }

    getBounds2(no) {
        return (this.type == 'Row' ? no.bounds.x2 : no.bounds.y2);
    }

    alignment() {
        /*
        ? Row and Column
       start
       center
       end
       spaceAround
       spaceBetween
       spaceEvenly
       */
    }
}

module.exports = {
    Children: Children,
};