const { Bounds } = require("../bounds");
const { Parameter, ParameterRef } = require("./util/parameter");
const { getColor } = require("./util/color");
const { titleCase } = require("./util/widgets_util");
const { googleFonts } = require("./util/google_fonts");
const { changeOutputUiText } = require("../ui/components/output_ui");

class TextWidget {
    constructor(xdNode) {
        this.xdNode = xdNode;
        this.bounds = new Bounds(xdNode);
        this.parameters = {};

        let textParam = new Parameter(this, "String", "text", xdNode.text);
        this.parameters["text"] = new ParameterRef(textParam, true, 'teste2');

        let colorParam = new Parameter(this, "Color", "fill", xdNode.fill);
        this.parameters["fill"] = new ParameterRef(colorParam, true, 'teste');
    }

    toDart() {
        let str, o = this.xdNode, params = this.parameters;

        checkForUnsupportedFeatures(o);

        if (o.styleRanges.length > 1) {
            str = _getTextRich(o, params);
        } else {
            str = _getText(o, params);
        }
        if (o.areaBox) {
            let w = o.localBounds.width;
            let h = o.localBounds.height;
            str = `SizedBox(width: ${w}, height: ${h}, child: ${str},)`;
        }
        return str;
    }

}

exports.TextWidget = TextWidget;

function checkForUnsupportedFeatures(o) {
    if (o.textScript !== 'none') {
        changeOutputUiText('Superscript & subscript are not currently supported.', 'Brown');
    }
    if (o.paragraphSpacing) {
        changeOutputUiText('Paragraph spacing is not currently supported.', 'Brown');
    }
    if (o.strokeEnabled && o.stroke) {
        changeOutputUiText('Text border is not currently supported.', 'Brown');
    }
}

function _textTransformation(text, xdNode) {
    if (xdNode.textTransform == 'none') return text;
    if (xdNode.textTransform == 'uppercase') return text.toUpperCase().split('\\N').join('\\n');
    if (xdNode.textTransform == 'lowercase') return text.toLowerCase();
    if (xdNode.textTransform == 'titlecase') return titleCase(text);
    throw xdNode.textTransform;
}

function _getText(xdNode, params) {
    let textParam = params["text"].isOwn
        ? `'${escapeString(xdNode.text)}'`
        : params["text"].name;
    textParam = _textTransformation(textParam, xdNode);
    return 'Text('
        + `${textParam},` +
        _getStyleParam(xdNode, _getTextStyleParamList(xdNode, null, params)) +
        _getTextAlignParam(xdNode) +
        ')';
}

function escapeString(str) {
    return str.replace(/(['\\$])/g, '\\$1') // escaped characters
        .replace(/\n/g, '\\n'); // line breaks
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
        '  ' + _getStyleParam(xdNode, defaultStyleParams) +
        `  children: [${str}],` +
        `), ${_getTextAlignParam(xdNode)})`;

}

function _getTextSpan(params, text, xdNode) {
    text = escapeString(text);
    text = _textTransformation(text, xdNode);
    return 'TextSpan(' +
        ` text: '${text}',` +
        _getStyleParam(xdNode, params) +
        ')';
}

function _getTextAlignParam(xdNode) {
    const align = _getTextAlign(xdNode.textAlign)
    if (align == 'TextAlign.left') return '';
    return `textAlign: ${align}, `;
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

exports._getTextStyleParamList = _getTextStyleParamList;

function _getStyleParam(xdNode, params, withTag = true) {
    if (!params) { return ''; }
    const { getParamList } = require("../util");
    let str = getParamList(params);
    const family = _getFontFamilyName(xdNode);
    const tag = withTag ? 'style: ' : '';
    const end = withTag ? ',' : '';
    if (googleFonts.includes(family)) {
        return (!str ? '' : `${tag}GoogleFonts.${family}(${str})${end}`);
    }
    return (!str ? '' : `${tag}TextStyle(${str})${end} `);
}

exports._getStyleParam = _getStyleParam;

function _getFontFamilyName(node) {
    let family = node.fontFamily.replace(/\s+/g, '');
    family = family[0].toLowerCase() + family.substring(1, family.length);
    if (googleFonts.includes(family)) {
        return family;
    }
    return node.fontFamily;
}

function _getFontFamily(o) {
    return o.fontFamily;
}

function _getFontFamilyParam(o) {
    const family = _getFontFamilyName(o);
    if (googleFonts.includes(family)) return '';
    return `fontFamily: '${_getFontFamily(o)}', `;
}

function _getFontSizeParam(o) {
    return `fontSize: ${o.fontSize}, `;
}

function _getColorParam(o, params) {
    const { getOpacity } = require("../util");
    return `color: ${params["fill"].isOwn
        ? getColor(o.fill, getOpacity(o))
        : params["fill"].name}, `;
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
    return (xdNode.shadow == null || !xdNode.shadow.visible ? '' :
        `shadows: [${_getShadow(xdNode.shadow)}], `);
}

function _getShadow(shadow) {
    let o = shadow;
    return `Shadow(color: ${getColor(o.color)}, ` +
        (o.x || o.y ? `offset: Offset(${o.x}, ${o.y}), ` : '') +
        (o.blur ? `blurRadius: ${o.blur}, ` : '') + '),';
}

function _getTextAlign(align) {
    return 'TextAlign.' + (align == 'right' ? 'right' :
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
