var throwr = require('../generateWidget');

async function generateList(list, item, withDivision) {
    await item.forEach(async function (child) {
        if (throwr.throwr == undefined) {
            let name = child.constructor.name;
            if (name == "Ellipse" && withDivision) {
                throwr.throwr = `${name} with Division`;
            } else if (name == "RepeatGrid"/* || name == "SymbolInstance" || name == "Line"*/) {
                throwr.throwr = `${name}`;
            } else {
                if (name == "Group" || name == "Artboard") {
                    if (name == "Artboard") {
                        list.push(child);
                    }
                    if (child.name.includes("svg")) {
                        list.push(child);
                    } else {
                        await generateList(list, child.children, withDivision);
                    }
                } else {
                    list.push(child);
                }
            }
        }
    });
    return throwr.throwr;
}

module.exports = { generateList };