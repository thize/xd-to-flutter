const { randomColor } = require("./util/widgets_util");
const { Bounds } = require("../bounds");

class InkWellWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart(childWidget) {
        const { itemsToDart } = require("../items_to_dart");
        const child = !childWidget ? itemsToDart(this.XdNode.children) : childWidget;
        return `
        InkWell(
            onTap: (){
                //TODO: onTap ${this.XdNode.name}
            },
            child: ${child},
        )`;
    }
}

exports.InkWellWidget = InkWellWidget;