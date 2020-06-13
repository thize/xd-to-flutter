const scenegraph = require("scenegraph");
const { generateArtboards } = require("./generate");
const { exportFiles } = require("./project_folder");
const { changeOutputUiText } = require("./ui/components/output_ui");
const { cleanVarName } = require("./widgets/util/widgets_util");
const { generateComponents } = require("./generate");
const { formatDart } = require("./widgets/util/format_dart");
const assets = require("assets");
const { Parameter, ParameterRef } = require("./widgets/util/parameter");
const { _getStyleParam, _getTextStyleParamList } = require("./widgets/text");
const { applyRegex } = require("./util");
const { _getFillParam } = require("./widgets/util/decorations");
const { getColor } = require("./widgets/util/color");
let components = [];
let componentsNames = [];

function exportAll(type) {
    if (type == 'Components') {
        exportAllComponents();
    } else if (type == 'TextStyles') {
        exportAllTextStyles();
    } else if (type == 'Colors') {
        exportAllColors();
    } else {
        exportAllArtboards();
    }
}

function exportAllArtboards() {
    getComponents();
    const artboards = scenegraph.selection.editContext.children;
    const fileArtboardsName = [];
    const generatedArtboards = generateArtboards(artboards, false);
    artboards.forEach(artboard => {
        let name = cleanVarName(artboard.name, true);
        fileArtboardsName.push(`${name}.dart`);
    });
    generatedArtboards.forEach((artboard, i) => {
        generatedArtboards[i] = getImports(artboard, componentsNames) + artboard;
    });
    changeOutputUiText('Exporting Artboard Dart Files');
    exportFiles(fileArtboardsName, generatedArtboards, 'Artboards');
}

function exportAllComponents() {
    getComponents();
    const fileComponentsName = [];
    const componentsWidgets = generateComponents(components);
    components.forEach(c => {
        const name = `${cleanVarName(c.name)}.dart`;
        fileComponentsName.push(name);
    });
    if (componentsWidgets.length > 0) {
        componentsWidgets.forEach((c, i) => {
            componentsWidgets[i] = getImports(c, componentsNames) + c;
        });
        changeOutputUiText('Exporting Components Dart Files');
        exportFiles(fileComponentsName, componentsWidgets, 'Components');
    } else {
        changeOutputUiText('No master components on Artboards', 'red');
    }
}

function exportAllColors() {
    const assetsColors = assets.colors.get();
    let resColors = '';
    assetsColors.forEach((assetsColor, index) => {
        const name = assetsColor.name != null ? assetsColor.name : `color${index + 1}`;
        const generatedColor = _isGradient(assetsColor) ? _gradientColorList(assetsColor) : getColor(assetsColor.color)
        const staticType = _isGradient(assetsColor) ? 'List<Color>' : 'Color';
        const generatedStaticColor = `static ${staticType} get ${name} => ${generatedColor};`
        resColors += generatedStaticColor + '\n';
    });
    if (resColors == '') {
        changeOutputUiText('Without Colors in Assets Panel', 'red');
    } else {
        const prefix = widgetPrefix();
        let appColorsClass = formatDart(`class ${prefix}AppColors {${resColors}}`);
        const materialImport = `import 'package:flutter/material.dart';\n\n`;
        appColorsClass = materialImport + appColorsClass;
        changeOutputUiText('Exporting app_colors.dart');
        exportFiles(['app_colors.dart'], [appColorsClass]);
    }
}

function exportAllTextStyles() {
    const assetsTextStyles = assets.characterStyles.get();
    let resStyles = '';
    assetsTextStyles.forEach((assetsTextStyle, index) => {
        const name = assetsTextStyle.name != null ? assetsTextStyle.name : `textStyle${index + 1}`;
        const generatedTextStyle = _generateTextStyle(assetsTextStyle.style);
        const generatedStaticTextStyle = `static TextStyle get ${name} => const ${generatedTextStyle};`
        resStyles += generatedStaticTextStyle + '\n';
    });
    if (resStyles == '') {
        changeOutputUiText('Without Text Styles in Assets Panel', 'red');
    } else {
        resStyles = applyRegex(resStyles);
        const prefix = widgetPrefix();
        let appTextStylesClass = formatDart(`class ${prefix}AppTextStyles {${resStyles}}`);
        changeOutputUiText('Exporting app_textStyles.dart');
        appTextStylesClass = getImportsTextStyle(appTextStylesClass) + appTextStylesClass;
        exportFiles(['app_textStyles.dart'], [appTextStylesClass], 'TextStyles');
    }
}


function getImports(widget, componentsNames) {
    const material = `import 'package:flutter/material.dart';\n`;
    const svg = widget.includes('SvgPicture.string') ? `import 'package:flutter_svg/flutter_svg.dart';\n` : '';
    const googleFonts = widget.includes('GoogleFonts.') ? `import 'package:google_fonts/google_fonts.dart';\n` : '';
    const math = widget.includes('Transform.rotate') ? `import 'dart:math';\n` : '';
    const simplecode = widget.includes('sz(') ? `import 'package:simple_code/simple_code.dart';\n` : '';
    let importsComponents = '';
    componentsNames.forEach(c => {
        if (widget.includes(`const ${c}`) && !widget.includes(`class ${c}`)) {
            importsComponents += `import '${c}.dart';\n`;
        }
    });
    return material + svg + googleFonts + math + simplecode + importsComponents + '\n';
}

function getImportsTextStyle(widget) {
    const material = `import 'package:flutter/material.dart';\n`;
    const googleFonts = widget.includes('GoogleFonts.') ? `import 'package:google_fonts/google_fonts.dart';\n` : '';
    return material + googleFonts + '\n';
}

function getComponents() {
    components = [];
    const usedComponentsId = [];
    const artboards = scenegraph.selection.editContext.children;
    artboards.forEach(async artboard => {
        let isArtboard = artboard.constructor.name == "Artboard";
        if (isArtboard) {
            getComponentsFromGroup(artboard, components, usedComponentsId);
        }
    });
    componentsNames = [];
    components.forEach(c => {
        componentsNames.push(cleanVarName(c.name));
    });
}

function getComponentsFromGroup(group, components, usedComponentsId) {
    group.children.forEach(async child => {
        const childName = child.constructor.name;
        const isSymbolInstance = childName == "SymbolInstance";
        const isNotIncluded = !usedComponentsId.includes(child.symbolId);
        const isMaster = child.isMaster;
        const isComponentMaster = isSymbolInstance && isNotIncluded && isMaster;
        if (isComponentMaster) {
            usedComponentsId.push(child.symbolId);
            components.push(child);
            getComponentsFromGroup(child, components, usedComponentsId);
        } else if (childName == "Group") {
            getComponentsFromGroup(child, components, usedComponentsId);
        }
    });
}

module.exports = {
    exportAll: exportAll,
};

function widgetPrefix() {
    const element = document.getElementById('widgetsPrexix');
    const prefix = element != null ? element.value : element;
    if (!prefix) return '';
    return prefix;
}


function _generateTextStyle(xdNode) {
    let parameters = {};

    let colorParam = new Parameter(this, "Color", "fill", xdNode.fill);
    parameters["fill"] = new ParameterRef(colorParam, true, 'teste');

    return _getStyleParam(xdNode, _getTextStyleParamList(xdNode, null, parameters), false);
}


function _isGradient(fill) {
    return fill.startY != null || (fill.colorStops != null && fill.colorStops.length > 0);
}

function _gradientColorList(gradient) {
    let colors = [];
    gradient.colorStops.forEach(colorStop => {
        colors.push(dartColor(colorStop.color));
    });
    return `[${colors}]`;
}
