async function xdToArray(item) {
    let list = [];
    await item.forEach(async function (child) {
        let name = child.constructor.name;
        if (name == "RepeatGrid") {
            child.children.forEach(function (groupComponent) {
                groupComponent.children.forEach(function (component) {
                    list.push(component);
                });
            });
        } else if (name == "SymbolInstance" || name == "Group" || name == "Artboard") {
            if (name == "Artboard") {
                list.push(child);
            }
            if (child.name.includes("svg") || child.mask) {
                list.push(child);
            } else {
                let newList = await xdToArray(child.children);
                newList.forEach(function (item) {
                    list.push(item);
                });
            }
        } else {
            list.push(child);
        }
    });
    return list;
}

module.exports = { xdToArray };