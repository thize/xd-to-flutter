const { Bounds } = require("../bounds");
const { StatelessWidget } = require("./stateless");

class ComponentWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
    }

    toDart() {
        const { findMasterForSymbolId } = require("../util");
        const { cleanVarName } = require("./util/widgets_util");
        const master = findMasterForSymbolId(this.xdNode.symbolId);
        const componentName = !master ? this.xdNode.name : master.name;
        return `const ${cleanVarName(componentName, true)}()`;
    }

    toDartClass() {
        const { itemsToDart } = require("../items_to_dart");
        const { findMasterForSymbolId } = require("../util");
        const { wrapWithInkWell } = require("./util/widgets_util");
        const master = findMasterForSymbolId(this.xdNode.symbolId);
        const componentName = !master ? this.xdNode.name : master.name;
        let dartComponent = itemsToDart(this.xdNode.children);
        dartComponent = wrapWithInkWell(this.xdNode, dartComponent);
        return new StatelessWidget(componentName, dartComponent).toDart();
    }
}

exports.ComponentWidget = ComponentWidget;