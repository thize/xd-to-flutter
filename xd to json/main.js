const { generateJson } = require("./src/functions/json/generateJson");
const { generateList } = require("./src/functions/generateList"); 
const { error } = require("./dialog/dialogs");
const fs = require("uxp").storage.localFileSystem;
//let clipboard = require("clipboard");

//TODO:
/*
json to widget em js
botao para exportar com divisor
botao para exportar com simple_code
botao para exportar com spacer, sized box ou nenhum
*/

async function exportJson(selection) {
    if (selection.items.length != 0) {
        var list = [];
        generateList(list, selection.items);
        var json = generateJson(list);
        const folder = await fs.getFolder();
        const cFile = await folder.createFile("widgets.json", { overwrite: true });
        await cFile.write(json);
        
    } else {
        error("Error", "Select something");
    }
}

module.exports = {
    commands: {
        createCode: exportJson,
    },
};