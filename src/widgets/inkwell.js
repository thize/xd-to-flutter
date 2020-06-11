const { Bounds } = require("../bounds");

class InkWellWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
    }

    toDart(childWidget) {
        const { itemsToDart } = require("../items_to_dart");
        const child = !childWidget ? itemsToDart(this.xdNode.children) : childWidget;
        return `
        InkWell(
            onTap: (){
                //TODO: onTap ${this.xdNode.name}
                print('onTap ${this.xdNode.name}');
            },
            child: ${child},
        )`;
    }
}

exports.InkWellWidget = InkWellWidget;