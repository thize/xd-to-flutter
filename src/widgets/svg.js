const { Bounds } = require("../bounds");
const xd = require("scenegraph");

class SvgWidget {
    constructor(xdNode) {
        this.shapes = [];
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
        if (xdNode.constructor.name == 'Group') {
            this.addShapesFromGroup(xdNode);
        } else {
            this.shapes.push(xdNode);
        }
    }

    toDart() {
        const node = this.xdNode;
        if (node.name.includes('svg_')) return this.assetSvg();
        const path = new Path(node);
        path.shapes = this.shapes;
        return path.toString();
    }

    assetSvg() {
        const node = this.xdNode;
        const { fix } = require("../util");
        let height = node.height;
        height = height != null ? height : node.localBounds.height;
        height = height == 0 ? 1 : height;
        let width = node.width;
        width = width != null ? width : node.localBounds.width;
        width = width == 0 ? 1 : width;
        let withStyledWidget = document.querySelector('input[name="simpleType"]');
        withStyledWidget = withStyledWidget != null ? withStyledWidget.checked : null;
        if (withStyledWidget) {
            return `
                //TODO: ${node.name}
            'assets/${node.name.replace('svg_', '')}.svg'.svgAsset().w(${fix(width)}).h(${fix(height)})`;
        }
        return `SvgPicture.asset(
                //TODO: ${node.name}
            'assets/${node.name.replace('svg_', '')}.svg',
            width: ${width},
            height: ${height},
        )`;
    }

    addShapesFromGroup(xdNode) {
        xdNode.children.forEach(child => {
            if (child.constructor.name == 'Group') {
                this.addShapesFromGroup(child);
            } else {
                this.shapes.push(child);
            }
        });
    }
}

exports.SvgWidget = SvgWidget;

class Path {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.shapes = [];
        this.viewBox = null;
    }

    calculateViewBox() {
        if (this.viewBox)
            return;

        this.viewBox = _calculateAggregateViewBox(this.shapes);
    }

    get boundsInParent() {
        this.calculateViewBox();
        return this.xdNode.transform.transformRect(this.viewBox);
    }

    adjustTransform() {
        this.calculateViewBox();
        return new xd.Matrix(1.0, 0.0, 0.0, 1.0, this.viewBox.x, this.viewBox.y);
    }

    toString() {
        let svg;
        const { fix } = require("../util");
        svg = `'${this.toSvgString()}'`;
        const node = this.xdNode;
        let height = node.height;
        height = height != null ? height : node.localBounds.height;
        height = height == 0 ? 1 : height;
        let width = node.width;
        width = width != null ? width : node.localBounds.width;
        width = width == 0 ? 1 : width;
        let withStyledWidget = document.querySelector('input[name="simpleType"]');
        withStyledWidget = withStyledWidget != null ? withStyledWidget.checked : null;
        if (withStyledWidget) {
            return `
                // ${this.xdNode.name}
                ${svg}.svgString().w(${fix(width)}).h(${fix(height)})`;
        }
        return `SvgPicture.string(
            // ${this.xdNode.name}
            ${svg},
            width: ${width},
            height: ${height},
        )`;
    }

    toSvgString() {
        this.calculateViewBox();
        const { fix } = require("../util");
        let vx = fix(this.viewBox.x);
        let vy = fix(this.viewBox.y);
        // For some reason xd can have a viewport with 0 extent so clamp it to 1
        let vw = fix(Math.max(this.viewBox.width, 1));
        let vh = fix(Math.max(this.viewBox.height, 1));

        let svg = "";
        for (let i = 0; i < this.shapes.length; ++i) {
            let o = this.shapes[i];
            if (o instanceof Path) {
                svg += _serializeSvgGroup(o);
            } else {
                svg += _serializeSvgShape(o);
            }
        }
        svg = `<svg viewBox="${vx} ${vy} ${vw} ${vh}" >${svg}</svg>`;

        return svg;
    }
}

exports.Path = Path;

function _serializeSvgGroup(node) {
    let result = "";
    let xform = _getSvgTransform(node.xdNode.transform);
    result += `<g transform="${xform}">`;
    for (let i = 0; i < node.shapes.length; ++i) {
        let o = node.shapes[i];
        if (o instanceof Path) {
            result += _serializeSvgGroup(o);
        } else {
            result += _serializeSvgShape(o);
        }
    }
    result += "</g>";
    return result;
}

function _serializeSvgShape(o) {
    let pathStr = o.pathData;
    const { getOpacity } = require("../util");
    let opacity = getOpacity(o);
    let fill = "none";
    let fillOpacity = opacity;
    let hasImageFill = false;
    let hasGradientFill = false;
    if (o.fill && o.fillEnabled) {
        hasImageFill = (o.fill instanceof xd.ImageFill);
        hasGradientFill = (o.fill instanceof xd.LinearGradient) || (o.fill instanceof xd.RadialGradient);
        if (hasImageFill) {
            fill = "url(#image)";
        } else if (hasGradientFill) {
            fill = "url(#gradient)";
        } else {
            fill = "#" + getRGBHex(o.fill);
            fillOpacity = (o.fill.a / 255.0) * opacity;
        }
    }
    if (hasImageFill) {
        throw 'Image fills are not supported on shapes.';
    }
    const { fix } = require("../util");
    let imagePath = hasImageFill ? getImagePath(o) : "";
    let imageWidth = fix(hasImageFill ? o.fill.naturalWidth : 0);
    let imageHeight = fix(hasImageFill ? o.fill.naturalHeight : 0);
    let stroke = (o.stroke && o.strokeEnabled) ? "#" + getRGBHex(o.stroke) : "none";
    let strokeOpacity = (o.stroke && o.strokeEnabled) ? (o.stroke.a / 255.0) * opacity : opacity;
    let strokeWidth = o.strokeWidth;
    let strokeDash = o.strokeDashArray.length > 0 ? o.strokeDashArray[0] : 0;
    let strokeGap = o.strokeDashArray.length > 1 ? o.strokeDashArray[1] : strokeDash;
    let strokeOffset = o.strokeDashArray.length > 0 ? o.strokeDashOffset : 0;
    let strokeMiterLimit = o.strokeJoins == xd.GraphicNode.STROKE_JOIN_MITER
        ? o.strokeMiterLimit : 0;
    let strokeCap = o.strokeEndCaps;
    let strokeJoin = o.strokeJoins;

    let fillAttrib = `fill="${fill}"`;
    if (fillOpacity != 1.0)
        fillAttrib += ` fill-opacity="${fix(fillOpacity, 2)}"`;
    let strokeAttrib = `stroke="${stroke}" stroke-width="${strokeWidth}"`;

    if (strokeOpacity != 1.0)
        strokeAttrib += ` stroke-opacity="${fix(strokeOpacity, 2)}"`;
    if (strokeGap != 0)
        strokeAttrib += ` stroke-dasharray="${strokeDash} ${strokeGap}"`;
    if (strokeOffset != 0)
        strokeAttrib += ` stroke-dashoffset="${strokeOffset}"`;
    if (strokeMiterLimit != 0)
        strokeAttrib += ` stroke-miterlimit="${strokeMiterLimit}"`;
    if (strokeCap != xd.GraphicNode.STROKE_CAP_BUTT)
        strokeAttrib += ` stroke-linecap="${strokeCap}"`;
    if (strokeJoin != xd.GraphicNode.STROKE_JOIN_MITER)
        strokeAttrib += ` stroke-linejoin="${strokeJoin}"`;

    let hasShadow = o.shadow && o.shadow.visible;
    if (hasShadow) {
        throw 'Shadows are not supported on shapes.';
    }
    let filterAttrib = hasShadow ? `filter="url(#shadow)"` : ``;
    let shadowOffsetX = hasShadow ? o.shadow.x : 0;
    let shadowOffsetY = hasShadow ? o.shadow.y : 0;
    let shadowBlur = hasShadow ? o.shadow.blur : 0;

    let defs = "";
    if (hasShadow) {
        defs += `<filter id="shadow"><feDropShadow dx="${shadowOffsetX}" dy="${shadowOffsetY}" stdDeviation="${shadowBlur}"/></filter>`;
    }
    if (hasImageFill) {
        defs += `<pattern id="image" patternUnits="userSpaceOnUse" width="${imageWidth}" height="${imageHeight}"><image xlink:href="${imagePath}" x="0" y="0" width="${imageWidth}" height="${imageHeight}" /></pattern>`;
    }
    if (hasGradientFill) {
        if (o.fill instanceof xd.LinearGradient) {
            const x1 = fix(o.fill.startX, 6);
            const y1 = fix(o.fill.startY, 6);
            const x2 = fix(o.fill.endX, 6);
            const y2 = fix(o.fill.endY, 6);
            defs += `<linearGradient id="gradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`;
            for (let stop of o.fill.colorStops) {
                const offset = fix(stop.stop, 6);
                const color = getARGBHexWithOpacity(stop.color);
                const opacity = stop.color.a !== 255 ? `stop-opacity="${fix(stop.color.a / 255.0, 2)}"` : "";
                defs += `<stop offset="${offset}" stop-color="#${color}" ${opacity} />`;
            }
            defs += `</linearGradient>`;
        } else if (o.fill instanceof xd.RadialGradient) {
            const inv = o.fill.gradientTransform.invert();
            const start = inv.transformPoint({ x: o.fill.startX, y: o.fill.startY });
            const end = inv.transformPoint({ x: o.fill.endX, y: o.fill.endY });
            const fx = fix(start.x, 6);
            const fy = fix(start.y, 6);
            const fr = fix(o.fill.startR, 6);
            const cx = fix(end.x, 6);
            const cy = fix(end.y, 6);
            const r = fix(o.fill.endR, 6);
            const a = fix(o.fill.gradientTransform.a, 6);
            const b = fix(o.fill.gradientTransform.b, 6);
            const c = fix(o.fill.gradientTransform.c, 6);
            const d = fix(o.fill.gradientTransform.d, 6);
            const e = fix(o.fill.gradientTransform.e, 6);
            const f = fix(o.fill.gradientTransform.f, 6);
            let xform = "";
            if (a !== 1.0 || b !== 0.0 || c !== 0.0 || d !== 1.0 || e !== 0.0 || f !== 0.0) {
                xform = `gradientTransform="matrix(${a} ${b} ${c} ${d} ${e} ${f})"`;
            }
            defs += `<radialGradient id="gradient" ${xform} fx="${fx}" fy="${fy}" fr="${fr}" cx="${cx}" cy="${cy}" r="${r}">`;
            for (let stop of o.fill.colorStops) {
                const offset = fix(stop.stop, 6);
                const color = getRGBHex(stop.color);
                const opacity = stop.color.a !== 255 ? `stop-opacity="${fix(stop.color.a / 255.0, 2)}"` : "";
                defs += `<stop offset="${offset}" stop-color="#${color}" ${opacity}/>`;
            }
            defs += `</radialGradient>`;
        }
    }
    defs = defs ? `<defs>${defs}</defs>` : "";

    o.transform.translate(o.localBounds.x, o.localBounds.y);
    const xform = _getSvgTransform(o.transform);
    let transformAttrib = xform ? `transform="${xform}"` : "";

    let str = `${defs}<path ${transformAttrib} d="${pathStr}" ${fillAttrib} ${strokeAttrib} ${filterAttrib}/>`;
    return str;
}

function _getSvgTransform(transform) {
    let result;
    const { fix } = require("../util");
    if (transform.a !== 1.0 || transform.b !== 0.0 || transform.c !== 0.0 || transform.d !== 1.0) {
        // Use full transform
        const a = fix(transform.a, 6);
        const b = fix(transform.b, 6);
        const c = fix(transform.c, 6);
        const d = fix(transform.d, 6);
        const e = fix(transform.e, 2);
        const f = fix(transform.f, 2);
        result = `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
    } else if (transform.e !== 0.0 || transform.f !== 0.0) {
        // Use offset transform
        const e = fix(transform.e, 2);
        const f = fix(transform.f, 2);
        result = `translate(${e}, ${f})`;
    } else {
        result = "";
    }
    return result;
}

function _calculateAggregateViewBox(shapes) {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = -Number.MAX_VALUE;
    let maxY = -Number.MAX_VALUE;

    for (let o of shapes) {
        if (o.boundsInParent.x < minX)
            minX = o.boundsInParent.x;
        if (o.boundsInParent.y < minY)
            minY = o.boundsInParent.y;
        if (o.boundsInParent.x + o.boundsInParent.width > maxX)
            maxX = o.boundsInParent.x + o.boundsInParent.width;
        if (o.boundsInParent.y + o.boundsInParent.height > maxY)
            maxY = o.boundsInParent.y + o.boundsInParent.height;
    }

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}


function getRGBHex(color) {
    return getColorComponent(color.r) +
        getColorComponent(color.g) +
        getColorComponent(color.b);
}
function getColorComponent(val) {
    return (val < 0x10 ? "0" : "") + Math.round(val).toString(16);
}

function getARGBHexWithOpacity(color, opacity = 1) {
    return getColorComponent(color.a * opacity) +
        getColorComponent(color.r) +
        getColorComponent(color.g) +
        getColorComponent(color.b);
}