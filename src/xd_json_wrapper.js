class XDMatrixWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
    }

    toJSON() {
        let result = {};
        const node = this.xdNode;
        return {
            type: node.constructor.name,
            ...result
        };
    }
}

class XDColorWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
    }

    toJSON() {
        let result = {};

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            a: node.a,
            r: node.r,
            g: node.g,
            b: node.b,
            ...result
        };
    }
}

class XDLinearGradientFillWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
    }

    toJSON() {
        let result = {};

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            colorStops: node.colorStops,
            startX: node.startX,
            startY: node.startY,
            endX: node.endX,
            endY: node.endY,
            ...result
        };
    }
}

class XDRadialGradientFillWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
    }

    toJSON() {
        let result = {};

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            ...result
        };
    }
}

class XDImageFillWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
    }

    toJSON() {
        let result = {};

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            SCALE_STRETCH: node.SCALE_STRETCH,
            SCALE_COVER: node.SCALE_COVER,
            scaleBehaviour: node.scaleBehaviour,
            mimeType: node.mimeType,
            isLinkedContent: node.isLinkedContent,
            naturalWidth: node.naturalWidth,
            naturalHeight: node.naturalHeight,
            ...result
        };
    }
}

class XDShadowWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
    }

    toJSON() {
        let result = {};

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            x: node.x,
            y: node.y,
            blur: node.blur,
            color: node.color,
            visible: node.visible,
            ...result
        };
    }
}

class XDBlurWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
    }

    toJSON() {
        let result = {};

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            blurAmount: node.blurAmount,
            brightnessAmount: node.brightnessAmount,
            fillOpacity: node.fillOpacity,
            isBackgroundEffect: node.isBackgroundEffect,
            visible: node.visible,
            ...result
        };
    }
}

class XDSceneNodeWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
    }

    toJSON() {
        let result = {};

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            guid: node.guid,
            parent: node.parent,
            children: node.children,
            isInArtworkTree: node.isInArtworkTree,
            isContainer: node.isContainer,
            selected: node.selected,
            visible: node.visible,
            opacity: node.opacity,
            transform: node.transform,
            translation: node.translation,
            rotation: node.rotation,
            globalBounds: node.globalBounds,
            localBounds: node.localBounds,
            boundsInParent: node.boundsInParent,
            topLeftInParent: node.topLeftInParent,
            localCenterPoint: node.localCenterPoint,
            globalDrawBounds: node.globalDrawBounds,
            name: node.name,
            hasDefaultName: node.hasDefaultName,
            locked: node.locked,
            markedForExport: node.markedForExport,
            hasLinkedContent: node.hasLinkedContent,
            ...result
        };
    }
}

class XDGraphicsNodeWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDSceneNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        let fill;
        try {
            fill = node.fill.toHex(true);
        } catch (error) {
            fill = node.fill;
        }
        return {
            type: node.constructor.name,
            fill: node.fill,
            fillEnabled: node.fillEnabled,
            stroke: node.stroke,
            strokeEnabled: node.strokeEnabled,
            strokeWidth: node.strokeWidth,
            strokePosition: node.strokePosition,
            strokeEndCaps: node.strokeEndCaps,
            strokeJoins: node.strokeJoins,
            strokeMiterLimit: node.strokeMiterLimit,
            strokeDashArray: node.strokeDashArray,
            strokeDashOffset: node.strokeDashOffset,
            shadow: node.shadow,
            blur: node.blur,
            pathData: node.pathData,
            hasLinkedGraphicFill: node.hasLinkedGraphicFill,
            ...result
        };
    }
}

class XDArtboardWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDGraphicsNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            width: node.width,
            height: node.height,
            viewportHeight: node.viewportHeight,
            ...result
        };
    }
}

class XDRectangleWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDGraphicsNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            width: node.width,
            height: node.height,
            cornerRadii: node.cornerRadii,
            hasRoundedCorners: node.hasRoundedCorners,
            effectiveCornerRadii: node.effectiveCornerRadii,
            ...result
        };
    }
}

class XDEllipseWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDGraphicsNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            radiusX: node.radiusX,
            radiusY: node.radiusY,
            isCircle: node.isCircle,
            ...result
        };
    }
}

class XDLineWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDGraphicsNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            start: node.start,
            end: node.end,
            ...result
        };
    }
}

class XDPathWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDGraphicsNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            pathData: node.pathData,
            ...result
        };
    }
}

class XDBooleanGroupWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDGraphicsNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            pathOp: node.pathOp,
            ...result
        };
    }
}

class XDTextWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDGraphicsNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            text: node.text,
            styleRanges: node.styleRanges,
            flipY: node.flipY,
            textAlign: node.textAlign,
            lineSpacing: node.lineSpacing,
            areaBox: node.areaBox,
            clippedByArea: node.clippedByArea,
            ...result
        };
    }
}

class XDGroupWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDSceneNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            mask: node.mask,
            ...result
        };
    }
}

class XDSymbolInstanceWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDSceneNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            symbolId: node.symbolId,
            ...result
        };
    }
}

class XDRepeatGridWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDSceneNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            width: node.width,
            height: node.height,
            numColumns: node.numColumns,
            numRows: node.numRows,
            paddingX: node.paddingX,
            paddingY: node.paddingY,
            cellSize: node.cellSize,
            ...result
        };
    }
}

class XDLinkedGraphicWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDSceneNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            ...result
        };
    }
}

class XDRootNodeWrapper {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.parentNodeWrapper = new XDSceneNodeWrapper(this.xdNode);
    }

    toJSON() {
        let result = {};

        if (this.parentNodeWrapper) {
            result = this.parentNodeWrapper.toJSON();
        }

        const node = this.xdNode;
        return {
            type: node.constructor.name,
            ...result
        };
    }
}

const WRAPPER_ASSIGNMENTS = {
    Matrix: XDMatrixWrapper,
    Color: XDColorWrapper,
    LinearGradientFill: XDLinearGradientFillWrapper,
    RadialGradientFill: XDRadialGradientFillWrapper,
    ImageFill: XDImageFillWrapper,
    Shadow: XDShadowWrapper,
    Blur: XDBlurWrapper,
    SceneNode: XDSceneNodeWrapper,
    GraphicsNode: XDGraphicsNodeWrapper,
    Artboard: XDArtboardWrapper,
    Rectangle: XDRectangleWrapper,
    Ellipse: XDEllipseWrapper,
    Line: XDLineWrapper,
    Path: XDPathWrapper,
    BooleanGroup: XDBooleanGroupWrapper,
    Text: XDTextWrapper,
    Group: XDGroupWrapper,
    SymbolInstance: XDSymbolInstanceWrapper,
    RepeatGrid: XDRepeatGridWrapper,
    LinkedGraphic: XDLinkedGraphicWrapper,
    RootNode: XDRootNodeWrapper
};

function getXDWrapper(node) {
    const wrapperName = WRAPPER_ASSIGNMENTS[node.constructor.name];
    if (wrapperName !== undefined) {
        return new wrapperName(node);
    }

    return undefined;
}

function getArtboardAsJSON(artboard) {
    const children = [];

    artboard.children.forEach(node => {
        if (getXDWrapper(node) !== undefined) {
            children.push(getXDWrapper(node));
        }
    });

    return children;
}

function getDocumentAsJSON(documentRoot) {
    const children = [];

    documentRoot.children.forEach(artboard => {
        children.push(getArtboardAsJSON(artboard));
    });

    return children;
}

module.exports = {
    getXDWrapper: getXDWrapper,
    getArtboardAsJSON: getArtboardAsJSON,
    getDocumentAsJSON: getDocumentAsJSON
};
