let clipboard = require("clipboard");
const { widgetText } = require("./widgets/text");
const { widgetContainer } = require("./widgets/container");
const { widgetSvg } = require("./widgets/svg");
const { inkWell, rotation } = require("./widgets/wrappers");
const { alert } = require("./dialogs/dialogs");

function generateWidget(node, child) {
    let widget;
    if (node.constructor.name == 'Text') {
        widget = widgetText(node);
    } else if (node.constructor.name == 'Rectangle' || node.constructor.name == 'Ellipse' || node.constructor.name == 'Line') {
        widget = widgetContainer(node, child);
    } else if (node.constructor.name == 'Artboard') {
        node.children.forEach(function (childNode, i) {
            if (i == 0) {
                widget = widgetGroup(childNode);
            }
        });
    } else if (node.constructor.name == 'Path') {
        widget = widgetSvg(node);
    } else {
        alert("Not implemented yet", `${node.constructor.name} not implemented yet`);
    }
    widget = inkWell(node, widget);
    widget = rotation(node, widget);
    return widget;
}

function widgetGroup(node) {
    let widget = "", height = "", width = "", itens = [];
    if (node.name.includes("column")) {
        itens = gerarChildren(node, 0);
        widget = column(node, itens);
        height = `height: sz(${node.boundsInParent["height"].toFixed(2)}),`;
    } else if (node.name.includes("row")) {
        itens = gerarChildren(node, 1);
        widget = row(node, itens);
        width = `width: sz(${node.boundsInParent["width"].toFixed(2)}),`;
    } else if (node.name.includes("stack")) {
        itens = gerarChildren(node, 2);
        widget = stack(node, itens);
        width = `width: sz(${node.boundsInParent["width"].toFixed(2)}),`;
        height = `height: sz(${node.boundsInParent["height"].toFixed(2)}),`;
    } else if (node.name.includes("cwc")) {
        let widgets = [];
        node.children.forEach(function (childNode, i) {
            widgets.push(childNode);
        });
        widget = gerarWidget(widgets[0], gerarWidget(widgets[1]));
        return widget;
    }
    return `new Container(
        alignment: Alignment.center,
        ${width}${height}${widget == "" ? "" : `child: ${widget},`}
    )`;
}



function gerarChildren(node, pos) {
    let widgets = [], itens = [];
    node.children.forEach(function (childNode, i) {
        widgets.push(childNode);
    })
    if (pos != 2) {
        widgets.reverse();
    }
    widgets.forEach(function (childNode, i) {
        itens.push(gerarWidget(childNode, null));
    });
    return itens;
}

module.exports = { generateWidget };


