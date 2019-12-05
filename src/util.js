let clipboard = require("clipboard");

function isEmptyMethodName(method, methodName) {
    return method && methodName == "";
}

function isNotEmptySelectionItens(selection) {
    return selection.items.length != 0;
}

function isSingleItem(selection) {
    return selection.items.length == 1 && selection.items[0].children.length < 2;
}

function showMessageWithColor(text, color) {
    const message = document.querySelector("#message");
    message.innerHTML = text;
    message.style.color = color;
    setTimeout(function () { message.innerHTML = ""; }, 1500);
}

function copyToClipboard(generatedWidget, withMethod, methodName) {
    if (withMethod) {
        generatedWidget = `${methodName}() =>
         ${generatedWidget};
        `;
    }
    clipboard.copyText(generatedWidget);
}

module.exports = { isEmptyMethodName, isSingleItem, showMessageWithColor, copyToClipboard, isNotEmptySelectionItens };