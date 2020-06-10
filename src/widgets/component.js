const { Bounds } = require("../bounds");

class ComponentWidget {
    constructor(XdNode) {
        this.XdNode = XdNode;
        this.bounds = new Bounds(XdNode);
    }

    toDart() {
        const { findMasterForSymbolId } = require("../util");
        const { cleanVarName } = require("./util/widgets_util");
        const master = findMasterForSymbolId(this.XdNode.symbolId);
        if (!master) {
            return `const ${cleanVarName(this.XdNode.name, true)}()`;
        }
        return `const ${cleanVarName(master.name, true)}()`;
    }
}

exports.ComponentWidget = ComponentWidget;