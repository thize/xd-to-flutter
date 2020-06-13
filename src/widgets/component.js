const { Bounds } = require("../bounds");
const { StatelessWidget } = require("./stateless");
const { formatDart } = require("./util/format_dart");

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
        let dartComponent = itemsToDart(this.xdNode.children, false);
        dartComponent = wrapWithInkWell(this.xdNode, dartComponent);
        const { applyRegex } = require("../util");
        dartComponent = formatDart(new StatelessWidget(componentName, dartComponent + ';').toDart());
        return applyRegex(dartComponent);
    }
}

exports.ComponentWidget = ComponentWidget;