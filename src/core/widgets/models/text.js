/*
Copyright 2020 Adobe
All Rights Reserved.
*/

const { Bounds } = require("../bounds");
const { width, height } = require("./utils/width_height");
const { fillToColor } = require("./utils/fill_to_color");
const { shadow } = require("./utils/shadow");
const { googleFonts } = require("./utils/google_fonts");
const { wrapWithInkWell } = require("./inkwell");
const { titleCase, simpleCode } = require("../util/util");
const { withGoogleFonts } = require("../../functions/util/util");

class Text {
    constructor(node) {
        this.node = node;
        const bounds = node.globalBounds;
        this.bounds = new Bounds(bounds.x, bounds.x + bounds.width, bounds.y, bounds.y + bounds.height);
    }

    toDart() {
        let node = this.node;
        return new XDText(node).toDart();
    }
}

module.exports = {
    Text: Text,
};

class XDText {
    constructor(node) {
        this.node = node;
    }

    toDart() {
        checkForUnsupportedFeatures(this.node);
        let widget;
        let params = {};
        if (this.node.styleRanges.length > 1) {
            widget = _getTextRich(this.node, params);
        } else {
            widget = _getText(this.node, params);
        }
        const dartCode = this.areaBox(widget);
        return wrapWithInkWell(this.node, dartCode);
    }

    areaBox(widget) {
        const node = this.node;
        let withAreaBox = node.areaBox != null;
        if (withAreaBox) {
            return `
                SizedBox(
                    ${width(node)}
                    ${height(node)}
                    child: ${widget},
                )`
        }
        return widget;
    }
}

function checkForUnsupportedFeatures(node) {
    if (node.textScript !== 'none') {
        throw 'Superscript';
    }
    if (node.paragraphSpacing) {
        throw 'ParagraphSpacing';
    }
    if (node.strokeEnabled && node.stroke) {
        throw 'TextBorder';
    }
}

function _getText(xdNode, params) {
    let textParam = params["text"]
        ? params["text"] : `${fixText(xdNode.text, xdNode)}`;
    return 'Text('
        + `${textParam},` + _getTextAlignParam(xdNode) +
        _getStyleParam(_getTextStyleParamList(xdNode, null, params), xdNode) +
        ')';
}

function _getTextRich(xdNode, params) {
    let text = xdNode.text;
    let styles = xdNode.styleRanges;
    let str = '', j = 0;
    let defaultStyleParams = _getTextStyleParamList(xdNode, styles[0], params, true);

    for (let i = 0; i < styles.length; i++) {
        let style = styles[i], l = style.length;
        if (style.length === 0) { continue; }
        let styleParams = _getTextStyleParamList(xdNode, styles[i], params);
        let delta = getParamDelta(defaultStyleParams, styleParams);
        if (i === styles.length - 1) { l = text.length - j; } // for some reason, XD doesn't always return the correct length for the last entry.
        str += _getTextSpan(delta, text.substr(j, l), xdNode) + ', ';
        j += l;
    }

    // Export a rich text object with an empty root span setting a default style.
    // Child spans set their style as a delta of the default.
    return 'Text.rich(TextSpan(' +
        '  ' + _getStyleParam(defaultStyleParams, xdNode) +
        `  children: [${str}],` +
        `), ${_getTextAlignParam(xdNode)})`;

}

// TODO: GS: Evaluate moving all of these into a serialize/text.js file.
function _getTextSpan(params, text, xdNode) {
    return 'TextSpan(' +
        ` text: '${escapeString(text)}',` +
        _getStyleParam(params, xdNode) +
        ')';
}
function escapeString(str) {
    return str.replace(/(['\\$])/g, '\\$1') // escaped characters
        .replace(/\n/g, '\\n'); // line breaks
}
function _getTextAlignParam(xdNode) {
    const textAlign = _getTextAlign(xdNode.textAlign);
    if (textAlign == '') return '';
    return `textAlign: ${textAlign}, `;
}

function _getTextStyleParamList(xdNode, styleRange, params, isDefault = false) {
    // Builds an array of style parameters.
    let o = styleRange || xdNode;
    return [
        _getFontFamilyParam(o),
        _getFontSizeParam(o),
        _getColorParam(o, params),
        _getLetterSpacingParam(o),
        // The default style doesn't include weight, decoration, or style (italic):
        (isDefault ? null : _getFontStyleParam(o)),
        (isDefault ? null : _getFontWeightParam(o)),
        (isDefault ? null : _getTextDecorationParam(o)),
        // Line height & shadows are set at the node level in XD, so not included for ranges:
        (!styleRange || isDefault ? _getHeightParam(xdNode) : null),
        (!styleRange || isDefault ? _getShadowsParam(xdNode) : null),
    ];
}

function _getStyleParam(params, node) {
    if (!params) { return ''; }
    let str = getParamList(params);
    let family = _getFontFamily(node);
    if (family == '') {
        family = _getFontFamily(node, true);
        return (!str ? '' : `style: GoogleFonts.${family}(${str}), `);
    }
    return (!str ? '' : `style: TextStyle(${str}), `);
}

function _getFontFamily(node, withGoogle) {
    let family = node.fontFamily.replace(/\s+/g, '');
    family = family[0].toLowerCase() + family.substring(1, family.length);
    if (withGoogleFonts() && googleFonts.includes(family)) {
        if (!withGoogle) {
            return '';
        }
        return family;
    }
    return node.fontFamily;
}

function _getFontFamilyParam(o) {
    if (_getFontFamily(o) == '') return '';
    return `fontFamily: '${_getFontFamily(o)}', `;
}

function _getFontSizeParam(o) {
    return `fontSize: ${simpleCode(o.fontSize)}, `;
}

function _getColorParam(node, params) {
    return `color: ${params["fill"]
        ? params["fill"]
        : fillToColor(node.fill, node)},`;
}

function _getLetterSpacingParam(o) {
    // Flutter uses pixel values for letterSpacing.
    // XD uses increments of 1/1000 of the font size.
    return (o.charSpacing === 0 ? '' :
        `letterSpacing: ${o.charSpacing / 1000 * o.fontSize}, `);
}

function _getFontStyleParam(o) {
    let style = _getFontStyle(o.fontStyle);
    return style ? `fontStyle: ${style}, ` : '';
}

function _getFontWeightParam(o) {
    let weight = _getFontWeight(o.fontStyle);
    return weight ? `fontWeight: ${weight}, ` : '';
}

function _getTextDecorationParam(o) {
    let u = o.underline, s = o.strikethrough, str = '';
    if (!u && !s) { return str; }
    if (u && s) {
        str = 'TextDecoration.combine([TextDecoration.underline, TextDecoration.lineThrough])';
    } else {
        str = 'TextDecoration.' + (u ? 'underline' : 'lineThrough');
    }
    return `decoration: ${str}, `;
}

function _getHeightParam(o) {
    // XD reports a lineSpacing of 0 to indicate default spacing.
    // Flutter uses a multiplier against the font size for its "height" value.
    // XD uses a pixel value.
    return (o.lineSpacing === 0 ? '' :
        `height: ${o.lineSpacing / o.fontSize}, `);
}

function _getShadowsParam(xdNode) {
    if (xdNode.shadow != null && xdNode.shadow.visible) {
        return `shadows: [${shadow(xdNode)}], `;
    }
    return '';
}

function _getTextAlign(align) {
    if (align == 'left') return '';
    return 'TextAlign.' + (align == 'right' ? 'end' :
        align === 'center' ? 'center' : 'left');
}

function _getFontStyle(style) {
    style = style.toLowerCase();
    let match = style.match(FONT_STYLES_RE);
    let val = match && FONT_STYLES[match];
    return val ? 'FontStyle.' + val : null;
}

function _getFontWeight(style) {
    style = style.toLowerCase();
    let match = style.match(FONT_WEIGHTS_RE);
    let val = match && FONT_WEIGHTS[match];
    return val ? 'FontWeight.' + val : null;
}

function _buildStyleRegExp(map) {
    let list = [];
    for (let n in map) { list.push(n); }
    return new RegExp(list.join('|'), 'ig');
}

// Used to translate font weight names from XD to Flutter constants:
// https://www.webtype.com/info/articles/fonts-weights/
const FONT_WEIGHTS = {
    'thin': 'w100',
    'hairline': 'w100',
    'extralight': 'w200',
    'ultralight': 'w200',
    'light': 'w300',
    'book': 'w300',
    'demi': 'w300',

    'normal': null, // w400
    'regular': null,
    'plain': null,

    'medium': 'w500',
    'semibold': 'w600',
    'demibold': 'w600',
    'bold': 'w700', // or 'bold'
    'extrabold': 'w800',
    'heavy': 'w800',
    'black': 'w900',
    'poster': 'w900',
}
const FONT_WEIGHTS_RE = _buildStyleRegExp(FONT_WEIGHTS);

const FONT_STYLES = {
    'italic': 'italic',
    'oblique': 'italic',
}
const FONT_STYLES_RE = _buildStyleRegExp(FONT_STYLES);

function fixText(text, node) {
    text = text.replace(/(['\\$])/g, '\\$1') // escaped characters
        .replace(/\n/g, '\\n');
    text = textTransform(text, node);
    if (text.includes("'")) {
        if (text.includes('"')) {
            text = `'${text.split("'").join("\\'")}'`;
        } else {
            text = `"${text}"`;
        }
    } else {
        text = `'${text}'`;
    }
    return text;
}

function textTransform(text, node) {
    if (node.textTransform == 'none') return text;
    if (node.textTransform == 'uppercase') return text.toUpperCase().split('\\N').join('\\n');
    if (node.textTransform == 'lowercase') return text.toLowerCase();
    if (node.textTransform == 'titlecase') return titleCase(text);
    throw node.textTransform;
}


function getParamDelta(defaultParams, params) {
    // Compares an array of params to an array of default params,
    // and returns a new array containing only the entries that differ,
    // or null if there is no difference.
    let delta = null;
    for (let i = 0; i < params.length; i++) {
        if (defaultParams[i] === params[i]) { continue; }
        if (delta === null) { delta = []; }
        delta.push(params[i]);
    }
    return delta;
}

function getParamList(arr) {
    let str = '';
    arr.forEach((o) => { if (o) { str += o; } });
    return str;
}
