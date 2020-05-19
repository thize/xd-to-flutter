const { Bounds } = require("../bounds");
const { width, height } = require("./utils/width_height");
const { fillToColor } = require("./utils/fill_to_color");
const { doubleWithTag } = require("./utils/double_with_tag");
const { shadow } = require("./utils/shadow");
const { googleFonts } = require("./utils/google_fonts");
const { wrapWithInkWell } = require("./inkwell");
const { titleCase } = require("../util/util");

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
        this.checkForUnsupportedFeatures();
        let widget;
        if (this.node.styleRanges.length > 1) {
            this.defaultTextSyle = this.textStyle();
            widget = this.richText();
        } else {
            widget = `
            Text(
                ${this.text()},
                ${this.align()}                
                ${this.textStyle()}
            )`;
        }
        const dartCode = this.areaBox(widget);
        return wrapWithInkWell(this.node, dartCode);
    }

    checkForUnsupportedFeatures() {
        const node = this.node;
        if (node.strokeEnabled && node.stroke) {
            throw "TextBorder";
        }
        if (node.textScript !== 'none') {
            throw "Superscript";
        }
        if (node.paragraphSpacing) {
            throw "ParagraphSpacing";
        }
        if (node.styleRanges.length > 1) {
            throw "RichText";
        }
    }

    richText() {
        let text = this.node.text;
        let styles = this.node.styleRanges;
        let textsSpans = ''; let j = 0;
        for (let i = 0; i < styles.length; i++) {
            let style = styles[i], l = style.length;
            if (style.length === 0) { continue; }
            if (i === styles.length - 1) { l = text.length - j; }
            textsSpans += this.textSpan(text.substr(j, l), this.textStyle(styles)) + ', ';
            j += l;
        }
        return `
        Text.rich(TextSpan(
              ${this.textStyle(styles)}
              children: [${textsSpans}],
              ${this.align()}
        )`;
    }

    textSpan(text, textStyle) {
        return `TextSpan(text:${this.fixText(text)}, ${textStyle})`;
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

    fontSize() {
        const node = this.node;
        return doubleWithTag('fontSize', node.fontSize);
    }

    textStyle() {
        const node = this.node;
        let family = node.fontFamily.replace(/\s+/g, '');
        family = family[0].toLowerCase() + family.substring(1, family.length);
        const content = `${this.fontSize()}${this.color()}${this.letterSpacing()}${this.height()}${this.fontWeight()}${this.decoration()}${this.fontItalic()}${this.shadow()}`;
        if (googleFonts.includes(family)) {
            return `style: GoogleFonts.${family}(${content}),`;
        }
        return `style: TextStyle(fontFamily: '${node.fontFamily}',${content}),`;
    }

    text() {
        const node = this.node;
        let text = this.fixText(node.text);
        return text;
    }

    shadow() {
        const node = this.node;
        if (node.shadow != null && node.shadow.visible) {
            return `shadows: [${shadow(node)}],`;
        }
        return '';
    }

    border() {
        return '';
    }

    letterSpacing() {
        return (this.node.charSpacing === 0 ? '' :
            `letterSpacing: ${this.node.charSpacing / 1000 * this.node.fontSize}, `);
    }

    color() {
        const node = this.node;
        const color = fillToColor(node.fill);
        return `color: ${color},`;
    }

    align() {
        const node = this.node;
        let tag = "textAlign:";
        let value;
        if (node.textAlign == 'right') {
            value = `TextAlign.end`;
        } else if (node.textAlign == 'center') {
            value = `TextAlign.center`;
        }
        if (value != null) return `${tag} ${value},`;
        return "";
    }

    decoration() {
        const node = this.node;
        let content;
        if (node.strikethrough && node.underline) {
            content = `TextDecoration.combine([TextDecoration.lineThrough, TextDecoration.underline],)`;
        } else if (node.strikethrough) {
            content = "TextDecoration.lineThrough";
        } else if (node.underline) {
            content = "TextDecoration.underline";
        }
        if (content != undefined) {
            return `decoration: ${content},`;
        }
        return "";
    }

    fontItalic() {
        let style = this.node.fontStyle.toLowerCase();
        let match = style.match(FONT_STYLES_RE);
        let val = match && FONT_STYLES[match];
        style = val ? 'FontStyle.' + val : null;
        return style ? `fontStyle: ${style}, ` : '';
    }

    fontWeight() {
        let style = this.node.fontStyle.toLowerCase();
        let match = style.match(FONT_WEIGHTS_RE);
        let val = match && FONT_WEIGHTS[match];
        let weight = val ? 'FontWeight.' + val : null;
        return weight ? `fontWeight: ${weight}, ` : '';
    }

    height() {
        return (this.node.lineSpacing === 0 ? '' :
            `height: ${this.node.lineSpacing / this.node.fontSize}, `);
    }

    fixText(text) {
        text = text.replace(/(['\\$])/g, '\\$1') // escaped characters
            .replace(/\n/g, '\\n');
        text = this.textTransform(text);
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

    textTransform(text) {
        if (this.node.textTransform == 'none') return text;
        if (this.node.textTransform == 'uppercase') return text.toUpperCase().split('\\N').join('\\n');
        if (this.node.textTransform == 'lowercase') return text.toLowerCase();
        if (this.node.textTransform == 'titlecase') return titleCase(text);
        throw this.node.textTransform;
    }
}

const FONT_WEIGHTS = {
    'thin': 'w100',
    'hairline': 'w100',
    'extralight': 'w200',
    'ultralight': 'w200',
    'light': 'w300',
    'book': 'w300',
    'demi': 'w300',

    'normal': null,
    'regular': null,
    'plain': null,

    'medium': 'w500',
    'semibold': 'w600',
    'demibold': 'w600',
    'bold': 'bold',
    'extrabold': 'w800',
    'heavy': 'w800',
    'black': 'w900',
    'poster': 'w900',
}

function _buildStyleRegExp(map) {
    let list = [];
    for (let n in map) { list.push(n); }
    return new RegExp(list.join('|'), 'ig');
}

const FONT_WEIGHTS_RE = _buildStyleRegExp(FONT_WEIGHTS);

const FONT_STYLES = {
    'italic': 'italic',
    'oblique': 'italic',
}
const FONT_STYLES_RE = _buildStyleRegExp(FONT_STYLES);


