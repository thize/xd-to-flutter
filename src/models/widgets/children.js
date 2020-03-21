// TODO: add Stack positioneds

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
        let widgets = [];
        this.updateBounds();
        this.node.children.forEach(child => {
            widgets.push(`${child.toDart()}`);
        });
        this.updateDistances();
        this.addDistancesToWidget(widgets);
        return `${this.type}(children: [${widgets},],)`;
    }

    /**
    * Call distanceToDart() in distance and put in Widgets list
    * widgets.push(distanceToDart(distance));
    */
    addDistancesToWidget(widgets) {
        if (this.distances.length > 0) {
            const withSpacer = true;
            this.withSpacer = withSpacer;
            for (let i = 0, qtd = 0; i < widgets.length; i++, qtd++) {
                const distance = this.distanceToDart(this.distances[qtd]);
                if (distance != ``) {
                    widgets.splice(i, 0, distance);
                    i++;
                }
            }
            if (withSpacer) {
                const distance = this.distanceToDart(this.distances[this.distances.length - 1]);
                if (distance != ``) {
                    widgets.push(distance);
                }
            }
        }
    }


    /**
    * This function update Children Bounds to be compatible with Father's Bounds
    */
    updateBounds() {
        if (this.node.father != null) {
            const type = this.type;
            const fatherIsChildren = this.node.father.isChildren();
            const isStack = type == `Stack` && !fatherIsChildren;
            if (type == `Column` || isStack) {
                this.node.bounds.y1 = this.node.father.bounds.y1;
                this.node.bounds.y2 = this.node.father.bounds.y2;
            }
            if (type == `Row` || isStack) {
                this.node.bounds.x1 = this.node.father.bounds.x1;
                this.node.bounds.x2 = this.node.father.bounds.x2;
            }
        }
    }

    /**
    * Add distances between widgets in Row or Column (no effect on Stack)
    */
    updateDistances() {
        this.distances = [];
        if (this.type != 'Stack') {
            let bounds = this.
                getBounds1(this.node);
            this.distances.push(this.
                getBounds1(this.node.children[0]) - bounds);
            for (let i = 1; i < this.node.children.length; i++) {
                const child = this.node.children[i];
                const antChild = this.node.children[i - 1];
                this.distances.push(this.
                    getBounds1(child) - this.getBounds2(antChild));
            }
            bounds = this.getBounds2(this.node);
            this.distances.push(bounds - this.getBounds2(this.node.children[this.node.children.length - 1]));
        }
    }

    /**
    * @return {String} Distance Dart code (Spacer or SizedBox)
    */
    distanceToDart(distance) {
        if (distance > 0) {
            if (this.withSpacer) {
                return `Spacer(flex:${Math.round(distance)})`
            }
            const width = this.type == 'Row' ? `width:${sz(distance, true)}` : ``;
            const height = this.type == 'Column' ? `height:${sz(distance, false)}` : ``;
            if (width != `` || height != ``) {
                return `SizedBox(${width}${height})`
            }
        }
        return ``;
    }

    /**
    * @return {number} x1 or y1 No bounds
    */
    getBounds1(no) {
        return (this.type == 'Row' ? no.bounds.x1 : no.bounds.y1);
    }

    /**
    * @return {number} x2 or y2 No bounds
    */
    getBounds2(no) {
        return (this.type == 'Row' ? no.bounds.x2 : no.bounds.y2);
    }

    alignment() {
        // TODO: improve row and column distances: (Unnecessary distances) to (MainAlignment.better)
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