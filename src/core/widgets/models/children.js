const { fixDouble } = require("./utils/fix_double");
const { alignment } = require("./utils/alignment");

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
        for (let index = 0; index < this.node.children.length; index++) {
            const child = this.node.children[index];
            if (this.type == 'Stack') {
                widgets.push(`${this.positioned(child)}`);
            } else {
                widgets.push(`${this.alignment(child)}`);
            }
        }
        this.updateDistances();
        const mainAxisAlignment = this.mainAxisAlignment();
        this.addDistancesToWidget(widgets, mainAxisAlignment);
        const dartCode = `${this.type}(${mainAxisAlignment}children: [${widgets},],)`;
        return this.sizedBox(dartCode);
    }

    positioned(child) {
        const node = this.node;
        let left = child.bounds.x1 - node.bounds.x1;
        let top = child.bounds.y1 - node.bounds.y1;
        let right = node.bounds.x2 - child.bounds.x2;
        let bot = node.bounds.y2 - child.bounds.y2;
        let positionedX = `right: ${right},`;
        if (left < right) {
            positionedX = `left: ${left},`;
            if (positionedX == 'left: 0,') {
                positionedX = '';
            }
        }
        let positionedY = `bottom: ${bot},`;
        if (top < bot) {
            positionedY = `top: ${top},`;
            if (positionedY == 'top: 0,') {
                positionedY = '';
            }
        }
        return `Positioned(${positionedX}${positionedY}child: ${child.toDart()},)`;
    }

    sizedBox(dartCode) {
        const width = `width:${fixDouble(this.node.bounds.x2 - this.node.bounds.x1)},`;
        const height = `height:${fixDouble(this.node.bounds.y2 - this.node.bounds.y1)},`;
        // return `Container(color:Colors.blue.withOpacity(0.2),${width}${height}child: ${dartCode},)`;
        return `SizedBox(${width}${height}child: ${dartCode},)`;
    }

    /**
    * Call distanceToDart() in distance and put in Widgets list
    * widgets.push(distanceToDart(distance));
    */
    addDistancesToWidget(widgets, mainAxisAlignment) {
        if (this.distances.length > 0 && mainAxisAlignment == '') {
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

    alignment(child) {
        const node = this.node;
        let left = child.bounds.x1 - node.bounds.x1;
        let top = child.bounds.y1 - node.bounds.y1;
        let right = node.bounds.x2 - child.bounds.x2;
        let bot = node.bounds.y2 - child.bounds.y2;
        let auxRight = right == 0 && left == 0 ? 1 : right;
        let auxBot = bot == 0 && top == 0 ? 1 : bot;
        const alignX = (left / (left + auxRight));
        const alignY = (top / (top + auxBot));
        let resAlignment = alignment(this.type == 'Row' ? 0.5 : alignX, this.type == 'Column' ? 0.5 : alignY);
        if ((this.type == 'Row' && alignY != 0.5 && top + bot > 0) || this.type == 'Column' && alignX != 0.5 && left + right > 0) {
            return `Align(alignment: ${resAlignment}, child: ${child.toDart()},)`;
        }
        return child.toDart();
    }

    /**
    * This function update Children Bounds to be compatible with Father's Bounds
    */
    updateBounds() {
        if (this.node.father != null) {
            const type = this.type;
            const fatherIsChildren = this.node.father.isChildren();
            const isStack = type == `Stack` && !fatherIsChildren;
            if (type == `Column`) {
                this.node.bounds.y1 = this.node.father.bounds.y1;
                this.node.bounds.y2 = this.node.father.bounds.y2;
                if (isStack) {
                    // this.node.bounds.x1 = this.node.father.bounds.x1;
                    // this.node.bounds.x2 = this.node.father.bounds.x2;
                }
            }
            if (type == `Row` || isStack) {
                this.node.bounds.x1 = this.node.father.bounds.x1;
                this.node.bounds.x2 = this.node.father.bounds.x2;
                if (isStack) {
                    // this.node.bounds.y1 = this.node.father.bounds.y1;
                    // this.node.bounds.y2 = this.node.father.bounds.y2;
                }
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
            for (let index = 0; index < this.distances.length; index++) {
                this.distances[index] = Math.round(this.distances[index]);
            }
        }
    }

    /**
    * @return {String} Distance Dart code (Spacer or SizedBox)
    */
    distanceToDart(distance) {
        if (distance > 0) {
            if (this.withSpacer) {
                if (distance < 1) {
                    return '';
                }
                return `Spacer(flex:${distance})`
            }
            const width = this.type == 'Row' ? `width:${fixDouble(distance, true)}` : ``;
            const height = this.type == 'Column' ? `height:${fixDouble(distance, false)}` : ``;
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

    mainAxisAlignment() {
        if (this.type == 'Row' || this.type == 'Column') {
            const dist = this.distances;
            let set = new Set(dist);
            if (set.size == 1) {
                return 'mainAxisAlignment: MainAxisAlignment.spaceEvenly,';
            }
            set = new Set(dist.slice(1, dist.length - 1));
            if (dist[0] == 0 && dist[dist.length - 1] == 0 && set.size == 1) {
                return 'mainAxisAlignment: MainAxisAlignment.spaceBetween,';
            }
            let first = dist[0];
            if (first != 0 && dist[dist.length - 1] == first && set.size == 1 && set.getByIdx(0) == first * 2) {
                return 'mainAxisAlignment: MainAxisAlignment.spaceAround,';
            }
        }
        return '';
    }
}

module.exports = {
    Children: Children,
};

Set.prototype.getByIdx = function (idx) {
    if (typeof idx !== 'number') throw new TypeError(`Argument idx must be a Number. Got [${idx}]`);

    let i = 0;
    for (let iter = this.keys(), curs = iter.next(); !curs.done; curs = iter.next(), i++)
        if (idx === i) return curs.value;

    throw new RangeError(`Index [${idx}] is out of range [0-${i - 1}]`);
}
