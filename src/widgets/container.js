const { Bounds } = require("../bounds");
const { getAlignmentByFather } = require("./util/alignment_by_father");
const { getColorOrDecorationParam } = require("./util/decorations");
const xd = require("scenegraph");
const { Parameter, ParameterRef } = require("./util/parameter");

class ContainerWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
        this.parameters = {};

        let hasImageFill = (this.xdNode.fill instanceof xd.ImageFill);
        let fillParam = new Parameter(this, hasImageFill ? "ImageFill" : "Color", "fill", this.xdNode.fill);
        this.parameters["fill"] = new ParameterRef(fillParam, true,
            hasImageFill ? getProp(this.xdNode, 'imageParamName') : null);

        let strokeParam = new Parameter(this, "Color", "stroke", this.xdNode.stroke);
        this.parameters["stroke"] = new ParameterRef(strokeParam, true);

        let strokeEnableParam = new Parameter(this, "Boolean", "strokeEnabled", this.xdNode.strokeEnabled);
        this.parameters["strokeEnabled"] = new ParameterRef(strokeEnableParam, true);
    }

    toDart(child) {
        const alignment = child != null ? getAlignmentByFather(child, this, true) : '';
        let childWidget = child != null ? `child:${child.toDart()},` : ``;
        let c = getColorOrDecorationParam(this.xdNode, this.parameters);
        return `Container(
            ${alignment}
            width: ${this.xdNode.localBounds.width},
            height: ${this.xdNode.localBounds.height},
            ${c}
            ${childWidget}
        )`;
    }
}

exports.ContainerWidget = ContainerWidget;
function getProp(xdNode, prop) {
    let o = xdNode.pluginData;
    return o && o[prop];
}