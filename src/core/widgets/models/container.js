const { Bounds } = require("../bounds");
const { width, height } = require("./utils/width_height");
const { fillToColor } = require("./utils/fill_to_color");
const { fixDouble } = require("./utils/fix_double");
const { fillToGradient } = require("./utils/fill_to_gradient");
const { shadow } = require("./utils/shadow");
const { wrapWithRotation } = require("./utils/rotation");
const { Rectangle } = require("scenegraph");
const { wrapWithInkWell } = require("./inkwell");
const { alignment } = require("./utils/alignment");
const { simpleCode } = require("../util/util");

let application = require("application");
const xd = require("scenegraph");
const ImageFill = require("scenegraph").ImageFill;

class Container {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.bounds = new Bounds(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    }

    toDart(child) {
        let node = this.node;
        const name = node.constructor.name;
        if (name == 'Line') {
            node = new XDLine(node).parseToRectangle();
        }
        let childWidget = child != null ? `child:${child.toDart()},` : ``;
        const dartCode = new XDRectangle(node, child).toDart(childWidget);
        return wrapWithRotation(wrapWithInkWell(this.node, dartCode), node);
    }
}

module.exports = {
    Container: Container,
};

class XDLine {
    constructor(node) {
        this.node = node;
    }

    parseToRectangle() {
        const node = this.node;
        let rect;
        application.editDocument(function () {
            rect = new Rectangle();
            const horizontal = node.globalBounds.width >= node.globalBounds.height;
            const width = horizontal ? node.globalBounds.width : node.strokeWidth;
            const height = !horizontal ? node.globalBounds.height : node.strokeWidth;
            const radius = node.strokeEndCaps == 'round' ? Math.min(width, height) / 2 : 0;
            rect.width = width;
            rect.height = height;
            rect.fill = node.stroke;
            rect.fillEnabled = node.strokeEnabled;
            rect.setAllCornerRadii(radius);
            rect.shadow = node.shadow;
            rect.strokeEnabled = false;
        });
        return rect;
    }
}

class XDRectangle {
    constructor(node, childNode) {
        this.node = node;
        this.childNode = childNode;
    }

    toDart(child) {
        const node = this.node;
        const fill = (this.withDecoration() || !node.fillEnabled) ? '' : `${this.color()}`;
        let alignment = '';
        if (child != '') alignment = this.alignment();
        let widget = `Container(${alignment}${height(node)}${width(node)}${fill}${this.decoration()}${child})`;
        return this.blur(widget);
    }

    alignment() {
        const childNode = this.childNode;
        const node = this.node;
        let left = childNode.bounds.x1 - node.globalBounds.x;
        let top = childNode.bounds.y1 - node.globalBounds.y;
        let right = (node.globalBounds.x + node.globalBounds.width) - (childNode.bounds.x2);
        let bot = (node.globalBounds.y + node.globalBounds.height) - (childNode.bounds.y2);
        right = right == 0 && left == 0 ? 1 : right;
        bot = bot == 0 && top == 0 ? 1 : bot;
        const alignX = (left / (left + right));
        const alignY = (top / (top + bot));
        const widgetAlignment = alignment(alignX, alignY);
        if (widgetAlignment == 'Alignment.topLeft') return '';
        return `alignment: ${widgetAlignment},`;
    }

    blur(widget) {
        const node = this.node;
        const clipType = node instanceof xd.Rectangle ? "ClipRect" : node instanceof xd.Ellipse ? "ClipOval" : null;
        if (node.blur && clipType != null) {
            const blur = node.blur;
            widget = widget.replace(
                /Color.*\, /g,
                function (txt) {
                    return txt = txt.substr(0, txt.length - 2) + `.withOpacity(${blur.fillOpacity}),`;
                }
            )
            let filter = `filter: ImageFilter.blur(sigmaX: ${blur.blurAmount}, sigmaY: ${blur.blurAmount}),`;
            return `${clipType}(child: BackdropFilter(${filter} child: ${widget},),)`;
        }
        return widget;
    }

    ellipseRadius() {
        const node = this.node;
        if (node.isCircle) {
            return "shape: BoxShape.circle,";
        } else {
            const x = simpleCode(fixDouble(node.radiusX * 2));
            const y = simpleCode(fixDouble(node.radiusY * 2));
            return `borderRadius: BorderRadius.all(Radius.elliptical(${x},${y})),`;
        }
    }

    withDecoration() {
        const hasRoundedCorners = this.borderRadius() != '';
        const hasImage = this.node.fill instanceof ImageFill;
        const hasGradient = this.gradient() != '';
        const hasBorder = this.border() != '';
        const hasShadow = this.shadow() != '';
        return hasRoundedCorners || hasGradient || hasBorder || hasShadow || hasImage;
    }

    shadow() {
        const node = this.node;
        if (node.shadow != null && node.shadow.visible) {
            return `boxShadow: [Box${shadow(node)}],`;
        }
        return '';
    }

    borderRadius() {
        const node = this.node;
        if (node.hasRoundedCorners) {
            return this.containerRadius();
        } else if (node.constructor.name == 'Ellipse') {
            return this.ellipseRadius();
        }
        return '';
    }

    containerRadius() {
        const node = this.node;
        let result = '';
        const radius = node.cornerRadii;
        const radiusSet = new Set();
        radiusSet.add(radius.topLeft);
        radiusSet.add(radius.topRight);
        radiusSet.add(radius.bottomRight);
        radiusSet.add(radius.bottomLeft);
        if (radiusSet.size == 1) {
            result = `BorderRadius.circular(${fixDouble(radius.bottomLeft)})`;
        } else {
            result = `BorderRadius.only(${this.radiusCircular('topLeft', radius.topLeft)}${this.radiusCircular('topRight', radius.topRight)}${this.radiusCircular('bottomLeft', radius.bottomLeft)}${this.radiusCircular('bottomRight', radius.bottomRight)})`;
        }
        return `borderRadius: ${result},`;
    }

    radiusCircular(tag, value) {
        if (value == 0) return '';
        return `${tag}: Radius.circular(${simpleCode(fixDouble(value))}),`;
    }

    border() {
        const node = this.node;
        if (node.strokeEnabled)
            return `border: Border.all(width: ${simpleCode(node.strokeWidth)},color: ${fillToColor(node.stroke)},),`; return '';
    }

    gradient() {
        const node = this.node;
        if (node.fillEnabled && node.fill.startX != null) {
            return `gradient: ${fillToGradient(node)},`;
        }
        return '';
    }

    color() {
        const node = this.node;
        if (!node.fillEnabled) return '';
        const isImage = node.fill instanceof ImageFill;
        if (isImage) {
            return `image: DecorationImage(//TODO: change image path
                image: const AssetImage('imagePath'),
                fit: BoxFit.fill,),`;
        }
        const color = fillToColor(node.fill);
        return `color: ${color}, `;
    }

    decoration() {
        if (this.withDecoration()) {
            let gradient = this.gradient();
            let fill = '';
            if (gradient == '') fill = `${this.color()}`;
            return `decoration: BoxDecoration(${fill}${this.border()}${this.borderRadius()}${this.shadow()}${gradient}),`;
        }
        return ``;
    }
}