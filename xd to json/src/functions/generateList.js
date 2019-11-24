const { error } = require("../../dialog/dialogs");

async function generateList(list, item) {
    await item.forEach(async function (child) {
        if (child.constructor.name == "RepeatGrid" || child.constructor.name == "SymbolInstance") {
            error("Error", `${child.constructor.name} not implemented`);
        } else {
            if (child.constructor.name == "Group" || child.constructor.name == "Artboard") {
                if (child.constructor.name == "Artboard") {
                    list.push(child);
                }
                if (child.name.includes("svg")) {
                    list.push(child);
                } else {
                    generateList(list, child.children);
                }
            } else {
                list.push(child);
            }
        }

    });
}

module.exports = { generateList };