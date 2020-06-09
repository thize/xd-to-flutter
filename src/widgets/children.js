const { Bounds } = require("../bounds");

class Children {
    /**
     * @param {No} node
     */
    constructor(type, node) {
        this.type = type;
        this.node = node;
    }

    toDart() {
        const widgets = [];
        this.node.children.forEach(child => {
            widgets.push(child.toDart());
        });
        const alignment = this.type == 'Stack' ? 'alignment: Alignment.center,' : 'mainAxisAlignment: MainAxisAlignment.spaceEvenly,';
        return `
        SizedBox(
            width: ${this.node.bounds.x2 - this.node.bounds.x1},
            height: ${this.node.bounds.y2 - this.node.bounds.y1},
            child: ${this.type}(
                ${alignment}
                children: [${widgets},],
            ),
        )`;
    }
}

exports.Children = Children;
