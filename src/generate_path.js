const scenegraph = require("scenegraph");
const clipboard = require("clipboard");
const { changeOutputUiText } = require("./ui/components/output_ui");
const { formatDart } = require("./widgets/util/format_dart");
const { fix } = require("./util");

function onTapGeneratePath() {
    const item = scenegraph.selection.items[0];
    const pathData = item.pathData;
    const lb = item.localBounds;
    const movs = [];
    const letters = new Set();
    pathData.split(' ').forEach((e) => {
        if (e.match(/^[A-Za-z]+$/)) {
            movs.push(new Mov(e));
            letters.add(e);
        } else {
            let value = parseFloat(e);
            movs[movs.length - 1].values.push(value);
        }
    });
    // var letterStr = '';
    // letters.forEach((letter) => {
    //     letterStr += `${letter}  -  `;
    // });
    // console.log(`Types = ${letterStr}`);
    movs.forEach((e) => {
        for (var i = 0; i < e.values.length; i++) {
            e.values[i] = fix((e.values[i] - (i % 2 == 0 ? lb.x : lb.y)));
        }
    });
    let dartCode = `Path path = Path()`;
    movs.forEach((e) => {
        const t = e.type;
        const v = e.values;
        if (t == 'M') {
            // [x, y]
            dartCode += `..moveTo(${nmn(v[0])}, ${nmn(v[1])})`
        } else if (t == 'L') {
            // [x, y]
            dartCode += `..lineTo(${nmn(v[0])}, ${nmn(v[1])})`
        } else if (t == 'C') {
            // [x1, y1, x2, y2, x3, y3]
            dartCode += `..cubicTo(${nmn(v[0])}, ${nmn(v[1])}, ${nmn(v[2])}, ${nmn(v[3])}, ${nmn(v[4])}, ${nmn(v[5])})`
        }
    });
    changeOutputUiText('Success');
    dartCode = formatDart(dartCode + ';');
    // console.log(`dartCode = ${dartCode}`);
    clipboard.copyText(dartCode);
}

exports.onTapGeneratePath = onTapGeneratePath;

function nmn(value) {
    const element = document.getElementById('numbersMethodName');
    let methodName = element != null ? element.value : element;
    methodName = methodName ? methodName : '';
    if (methodName == '') return value;
    return `${methodName}(${value})`;
}

class Mov {
    constructor(type) {
        this.values = [];
        this.type = type;
    }
}