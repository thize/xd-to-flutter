const { Bounds } = require("../bounds");
const { StatelessWidget } = require("./stateless");

class ComponentWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart() {
        const { findMasterForSymbolId } = require("../util");
        const { cleanVarName } = require("./util/widgets_util");
        const master = findMasterForSymbolId(this.XdNode.symbolId);
        const componentName = !master ? this.XdNode.name : master.name;
        return `const ${cleanVarName(componentName, true)}()`;
    }

    toDartClass() {
        const { itemsToDart } = require("../items_to_dart");
        const { findMasterForSymbolId } = require("../util");
        const { wrapWithInkWell } = require("./util/widgets_util");
        const master = findMasterForSymbolId(this.XdNode.symbolId);
        const componentName = !master ? this.XdNode.name : master.name;
        let dartComponent = itemsToDart(this.XdNode.children);
        dartComponent = wrapWithInkWell(this.XdNode, dartComponent);
        return new StatelessWidget(componentName, dartComponent).toDart();
    }
}

exports.ComponentWidget = ComponentWidget;