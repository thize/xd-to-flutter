const { generateJson } = require("./functions/json/generateJson");
const { generateList } = require("./functions/generateList");
const { generateWidgetFromJson } = require("./functions/widget/main");
const { showMessageWithColor } = require("../showMessageWithColor");
let clipboard = require("clipboard");
let withSimpleCode = require("../../main");
let withDivision = require("../../main");
let withGoogleFonts = require("../../main");
let scenegraph = require("scenegraph");
let throwr;


async function onTapGenerateWidget() {
    require("application").editDocument(async () => {
        const code = await generateWidget();
        if (code != null) {
            clipboard.copyText(code);
            showMessageWithColor("Copied to clipboard", "green");
        }
    });
}

async function generateWidget(SymbolInstance) {
    throwr = undefined;
    const simpleCode = withSimpleCode.withSimpleCode;
    const division = withDivision.withDivision;
    const wGoogleFonts = withGoogleFonts.withGoogleFonts;
    exports.throwr = throwr;
    if (SymbolInstance == null) {
        if (scenegraph.selection.items.length != 0) {
            let list = [];
            throwr = await generateList(list, scenegraph.selection.items, division, wGoogleFonts);
            if (throwr != undefined) {
                showMessageWithColor(`${throwr} not implemented`, "red");
                throw `${throwr} not implemented`;
            }
            let json = generateJson(list);
            let code = await generateWidgetFromJson(json, simpleCode, division, wGoogleFonts);
            return code;
        } else {
            showMessageWithColor("Select something", "grey");
        }
    } else {
        let list = [];
        throwr = undefined;
        throwr = await generateList(list, SymbolInstance.children, division, wGoogleFonts);
        if (throwr != undefined) {
            showMessageWithColor(`${throwr} not implemented`, "red", 'messageGlobal');
            throw `${throwr} not implemented`;
        }
        let json = generateJson(list);
        let code = await generateWidgetFromJson(json, simpleCode, division, wGoogleFonts);
        return code;
    }
}

module.exports = { onTapGenerateWidget, generateWidget };
