/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe. 
*/


const { Bounds } = require("../bounds");
const { getAlignmentByFather } = require("./util/alignment_by_father");
const { getColorOrDecorationParam, getStyledDecoration } = require("./util/decorations");
const xd = require("scenegraph");
const { Parameter, ParameterRef } = require("./util/parameter");
const { getColor } = require("./util/color");

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
        let withStyledWidget = document.querySelector('input[name="simpleType"]');
        withStyledWidget = withStyledWidget != null ? withStyledWidget.checked : null;
        if (withStyledWidget) return this.styledWidget(this.xdNode, child, this.parameters);
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

    styledWidget(xdNode, child, parameters) {
        const lb = xdNode.localBounds;
        let childWidget = child != null ? getStyledAlignmentByFather(child, this) : `boxWidget`;
        const { fix } = require("../util");
        let w = fix(lb.width);
        let h = fix(lb.height);
        if (w == h) {
            w = `.sq(${w})`;
            h = '';
        } else {
            w = `.w(${w})`;
            h = `.h(${h})`;
        }
        let d = '';
        let noCorner = !(xdNode instanceof xd.Ellipse);
        if (noCorner) {
            const radii = xdNode.cornerRadii;
            const tl = radii.topLeft, tr = radii.topRight, br = radii.bottomRight, bl = radii.bottomLeft;
            noCorner = tl == 0 && tl === tr && tl === br && tl === bl;
        }
        if (!xdNode.strokeEnabled && noCorner && !xdNode.shadow.visible && xdNode.fill instanceof xd.Color) {
            d = `.backgroundColor(${getColor(xdNode.fill)})`;
        } else {
            d = getStyledDecoration(xdNode, parameters);
        }
        return `${childWidget}${w}${h}${d}`;
    }
}

exports.ContainerWidget = ContainerWidget;

function getProp(xdNode, prop) {
    let o = xdNode.pluginData;
    return o && o[prop];
}


function getStyledAlignmentByFather(node, fatherNode) {
    const { xdAlignmentToDartAlignment } = require("./util/xd_alignment_to_dart_alignment");
    const top = node.bounds.y1 - fatherNode.bounds.y1;
    const right = fatherNode.bounds.x2 - node.bounds.x2;
    const bot = fatherNode.bounds.y2 - node.bounds.y2;
    const left = node.bounds.x1 - fatherNode.bounds.x1;
    let auxBot = bot == 0 && top == 0 ? 1 : bot;
    const alignY = (top / (top + auxBot));
    let auxRight = right == 0 && left == 0 ? 1 : right;
    const alignX = (left / (left + auxRight));
    const resAlignment = xdAlignmentToDartAlignment(alignX, alignY);
    if (resAlignment == 'Alignment.center') {
        return `${node.toDart()}.center()`;
    }
    if (resAlignment != 'Alignment.topLeft') {
        return `${node.toDart()}.alignment(${resAlignment})`;
    }
    if (onlyTag) return '';
    return node.toDart();
}
