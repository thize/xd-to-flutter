const { xdAlignmentToDartAlignment } = require('./util/xd_alignment_to_dart_alignment');

class Children {
    /**
     * @param {No} node
     */
    constructor(type, node) {
        this.type = type;
        this.node = node;
        this.isStack = this.type == 'Stack';
        this.stackAlignment = '';
        this.columnOrRowMainAlignment = '';
        this.columnOrRowCrossAlignment = '';
        this.childrenSpaces = [];
        this.w;
        this.h;
        this.isStart = false;
        this.isEnd = false;
    }

    toDart() {
        const widgets = [];
        if (this.node.father != null) {
            if (this.type == 'Row') {
                this.node.bounds.x1 = this.node.father.bounds.x1;
                this.node.bounds.x2 = this.node.father.bounds.x2;
            }
            if (this.type == 'Column') {
                this.node.bounds.y1 = this.node.father.bounds.y1;
                this.node.bounds.y2 = this.node.father.bounds.y2;
            }
        }
        this.getPositionedDistances();
        this.getChildrenSpaces();
        let withStyledWidget = document.querySelector('input[name="simpleType"]');
        withStyledWidget = withStyledWidget != null ? withStyledWidget.checked : null;
        this.buildWidgets(widgets, withStyledWidget);
        this.w = this.node.bounds.x2 - this.node.bounds.x1;
        this.h = this.node.bounds.y2 - this.node.bounds.y1;
        if (withStyledWidget) return this.simpleType(widgets);
        const width = `width: ${this.w},`;
        const height = `height: ${this.h},`;
        return `
            SizedBox(
            ${width}
            ${height}
            child: ${this.type}(
                ${this.stackAlignment}
                ${this.columnOrRowMainAlignment}
                ${this.columnOrRowCrossAlignment}
                children: <Widget>[${widgets},],
            ),
        )`;
    }

    simpleType(widgets) {
        const { fix } = require("../util");
        return `
        [${widgets}].to${this.type}(${this.stackAlignment})${this.columnOrRowMainAlignment}${this.columnOrRowCrossAlignment}.w(${fix(this.w)}).h(${fix(this.h)})
        `;
    }

    buildWidgets(widgets, withStyledWidget) {
        if (this.isStack) this.getStackAlignment();
        if (!this.isStack) this.getColumnOrRowMainAlignment(withStyledWidget);
        if (!this.isStack) this.getColumnOrRowCrossAlignment(withStyledWidget);
        this.node.children.forEach((child, index) => {
            if (this.isStack) {
                widgets.push(this.buildPositioneds(child, index, withStyledWidget));
            } else {
                this.buildSpacer(widgets, index, withStyledWidget);
                widgets.push(this.buildAlignment(child, index));
            }
        });
        if (!this.isStack) {
            this.buildSpacer(widgets, this.childrenSpaces.length - 1, withStyledWidget);
        }
    }

    buildSpacer(widgets, index, withStyledWidget) {
        if (this.columnOrRowMainAlignment == '') {
            const spacer = this.childrenSpaces[index];
            if (spacer > 0) {
                if (withStyledWidget) {
                    widgets.push(`s(${spacer})`);
                } else {
                    widgets.push(`Spacer(flex: ${spacer})`);
                }
            }
        }
    }

    getColumnOrRowMainAlignment(withSw) {
        const dist = this.childrenSpaces;
        let set = new Set(dist);
        if (set.size == 1) {
            if (set.getByIdx(0) == 0) return;
            this.columnOrRowMainAlignment = withSw ? '.mainSpaceEvenly' : 'mainAxisAlignment: MainAxisAlignment.spaceEvenly,';
            return;
        }
        set = new Set(dist.slice(1, dist.length - 1)); // remove first and last item of Set
        if (dist[0] == 0 && dist[dist.length - 1] == 0 && set.size == 1) {
            this.columnOrRowMainAlignment = withSw ? '.mainSpaceBetween' : 'mainAxisAlignment: MainAxisAlignment.spaceBetween,';
            return;
        }
        let first = dist[0];
        if (first != 0 && dist[dist.length - 1] == first && set.size == 1 && set.getByIdx(0) == first * 2) {
            this.columnOrRowMainAlignment = withSw ? '.mainSpaceAround' : 'mainAxisAlignment: MainAxisAlignment.spaceAround,';
            return;
        }
        let last = dist[dist.length - 1];
        if (first != 0 && last != 0 && first == last && set.size == 1 && set.getByIdx(0) == 0) {
            this.columnOrRowMainAlignment = withSw ? '.mainCenter' : 'mainAxisAlignment: MainAxisAlignment.center,';
            return;
        }
        set = new Set(dist.slice(1, dist.length)); // remove first and last item of Set
        if (first != 0 && set.size == 1 && set.getByIdx(0) == 0) {
            this.columnOrRowMainAlignment = withSw ? '.mainEnd' : 'mainAxisAlignment: MainAxisAlignment.end,';
            return;
        }
    }

    getColumnOrRowCrossAlignment(withSw) {
        let center = 0;
        let end = 0;
        let start = 0;
        for (let index = 0; index < this.topDistance.length; index++) {
            const top = this.topDistance[index];
            const bot = this.botDistance[index];
            const left = this.leftDistance[index];
            const right = this.rightDistance[index];
            const isColumn = this.type == 'Column';

            let resAlignment = '';
            if (isColumn) {
                if (left != right) {
                    let auxRight = right == 0 && left == 0 ? 1 : right;
                    const alignX = (left / (left + auxRight));
                    resAlignment = xdAlignmentToDartAlignment(alignX, 0.5);
                    if (resAlignment == 'Alignment.centerLeft') {
                        start++;
                    } else if (resAlignment == 'Alignment.centerRight') {
                        end++;
                    }
                } else {
                    center++;
                }
            } else {
                if (top != bot) {
                    let auxBot = bot == 0 && top == 0 ? 1 : bot;
                    const alignY = (top / (top + auxBot));
                    resAlignment = xdAlignmentToDartAlignment(0.5, alignY);
                    if (resAlignment == 'Alignment.topCenter') {
                        start++;
                    } else if (resAlignment == 'Alignment.bottomCenter') {
                        end++;
                    }
                } else {
                    center++;
                }
            }
        }
        if (center >= end && center >= start) return;
        if (end >= center && end >= start) {
            this.isEnd = true;
            this.columnOrRowCrossAlignment = withSw ? '.crossEnd' : 'crossAxisAlignment: CrossAxisAlignment.end,';
        }
        if (start >= center && start >= end) {
            this.isStart = true;
            this.columnOrRowCrossAlignment = withSw ? '.crossStart' : 'crossAxisAlignment: CrossAxisAlignment.start,';
        }
    }

    getChildrenSpaces() {
        const isColumn = this.type == 'Column';
        if (!this.isStack) {
            let antChildEnd = isColumn ? this.node.bounds.y1 : this.node.bounds.x1;
            this.node.children.forEach((child, index) => {
                if (isColumn) {
                    this.childrenSpaces.push(Math.floor(child.bounds.y1 - antChildEnd));
                    antChildEnd = child.bounds.y2;
                    if (this.node.children.length - 1 == index) {
                        this.childrenSpaces.push(Math.floor(this.node.bounds.y2 - antChildEnd));
                    }
                } else {
                    this.childrenSpaces.push(Math.floor(child.bounds.x1 - antChildEnd));
                    antChildEnd = child.bounds.x2;
                    if (this.node.children.length - 1 == index) {
                        this.childrenSpaces.push(Math.floor(this.node.bounds.x2 - antChildEnd));
                    }
                }
            });
        }
    }

    buildAlignment(child, index) {
        const widget = child.toDart();
        const top = this.topDistance[index];
        const bot = this.botDistance[index];
        const left = this.leftDistance[index];
        const right = this.rightDistance[index];
        const isColumn = this.type == 'Column';
        let resAlignment;
        let withStyledWidget = document.querySelector('input[name="simpleType"]');
        withStyledWidget = withStyledWidget != null ? withStyledWidget.checked : null;
        if (isColumn) {
            if (left != right) {
                let auxRight = right == 0 && left == 0 ? 1 : right;
                const alignX = (left / (left + auxRight));
                resAlignment = xdAlignmentToDartAlignment(alignX, 0.5);
                const aux = this.isEnd ? 'Alignment.centerRight' : this.isStart ? 'Alignment.centerLeft' : 'Alignment.center';
                if (resAlignment != aux) {
                    if (!withStyledWidget) {
                        return `Align(alignment: ${resAlignment}, child: ${child.toDart()},)`;
                    }
                    if (resAlignment == 'Alignment.center') {
                        return `${child.toDart()}.center()`;
                    }
                    return `${child.toDart()}.alignment(${resAlignment})`;
                }
            }
        } else {
            if (top != bot) {
                let auxBot = bot == 0 && top == 0 ? 1 : bot;
                const alignY = (top / (top + auxBot));
                resAlignment = xdAlignmentToDartAlignment(0.5, alignY);
                const aux = this.isEnd ? 'Alignment.bottomCenter' : this.isStart ? 'Alignment.topCenter' : 'Alignment.center';
                if (resAlignment != aux) {
                    if (!withStyledWidget) {
                        return `Align(alignment: ${resAlignment}, child: ${child.toDart()},)`;
                    }
                    if (resAlignment == 'Alignment.center') {
                        return `${child.toDart()}.center()`;
                    }
                    return `${child.toDart()}.alignment(${resAlignment})`;
                }
            }
        }
        return widget;
    }

    buildPositioneds(child, index, withStyledWidget) {
        const widget = child.toDart();
        const top = this.topDistance[index];
        const bot = this.botDistance[index];
        const left = this.leftDistance[index];
        const right = this.rightDistance[index];
        let horizontalPositioned = left == right ? '' : left < right ? left == 0 && this.isLeft ? '' : `left: ${left},` : right == 0 && this.isRight ? '' : `right: ${right},`;
        let verticalPositioned = top == bot ? '' : top < bot ? top == 0 && this.isTop ? '' : `top: ${top},` : bot == 0 && this.isBot ? '' : `bottom: ${bot},`;
        if (horizontalPositioned == '' && verticalPositioned == '') return widget;
        if (withStyledWidget) {
            horizontalPositioned = verticalPositioned == '' ? horizontalPositioned.substr(0, horizontalPositioned.length - 1) : horizontalPositioned;
            verticalPositioned = verticalPositioned.substr(0, verticalPositioned.length - 1);
            return `${widget}.positioned(${horizontalPositioned}${verticalPositioned})`;
        }
        return `
        Positioned(
            ${horizontalPositioned}
            ${verticalPositioned}
            child: ${widget},
        )
        `
    }

    getPositionedDistances() {
        this.topDistance = [];
        this.botDistance = [];
        this.leftDistance = [];
        this.rightDistance = [];
        this.node.children.forEach(child => {
            const top = child.bounds.y1 - this.node.bounds.y1;
            const bot = this.node.bounds.y2 - child.bounds.y2;
            const left = child.bounds.x1 - this.node.bounds.x1;
            const right = this.node.bounds.x2 - child.bounds.x2;
            this.topDistance.push(Math.floor(top));
            this.botDistance.push(Math.floor(bot));
            this.leftDistance.push(Math.floor(left));
            this.rightDistance.push(Math.floor(right));
        });
    }

    getStackAlignment() {
        if (!this.isStack) return '';
        let top = 0;
        let bot = 0;
        let left = 0;
        let right = 0;
        let verticalCenter = 0;
        let horizontalCenter = 0;
        for (let i = 0; i < this.topDistance.length; i++) {
            if (this.topDistance[i] == 0) top++;
            if (this.botDistance[i] == 0) bot++;
            if (this.leftDistance[i] == 0) left++;
            if (this.rightDistance[i] == 0) right++;
            if (this.rightDistance[i] == this.leftDistance[i]) horizontalCenter++;
            if (this.topDistance[i] == this.botDistance[i]) verticalCenter++;
        }
        this.isHorizontalCenter = horizontalCenter > left && horizontalCenter > right;
        this.isVerticalCenter = verticalCenter > top && verticalCenter > bot;
        this.isRight = !this.isHorizontalCenter && right > left;
        this.isBot = !this.isVerticalCenter && bot > top;
        this.isTop = !this.isBot && !this.isVerticalCenter;
        this.isLeft = !this.isRight && !this.isHorizontalCenter;
        let alignment;
        if (this.isRight) {
            if (this.isBot) alignment = 'bottomRight';
            else if (this.isVerticalCenter) alignment = 'centerRight';
            else if (this.isTop) alignment = 'topRight';
        } else if (this.isLeft) {
            if (this.isBot) alignment = 'bottomLeft';
            else if (this.isVerticalCenter) alignment = 'centerLeft';
        } else {
            if (this.isBot) alignment = 'bottomCenter';
            else if (this.isTop) alignment = 'topCenter';
            else if (this.isVerticalCenter) alignment = 'center';
        }
        if (!alignment) return;
        this.stackAlignment = `alignment: Alignment.${alignment},`;
    }
}

exports.Children = Children;

Set.prototype.getByIdx = function (idx) {
    if (typeof idx !== 'number') throw new TypeError(`Argument idx must be a Number. Got [${idx}]`);

    let i = 0;
    for (let iter = this.keys(), curs = iter.next(); !curs.done; curs = iter.next(), i++)
        if (idx === i) return curs.value;

    throw new RangeError(`Index [${idx}] is out of range [0-${i - 1}]`);
}
