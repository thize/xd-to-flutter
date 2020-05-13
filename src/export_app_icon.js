const scenegraph = require("scenegraph");
const { AppIcon, showDialog } = require("./models/app_icon");
const fs = require("uxp").storage.localFileSystem;

async function exportAppIcon(platform) {
    const item = scenegraph.selection.items[0];
    if (item == null) return showDialog("Select something", true);
    if (validateSize(item)) return showDialog("Selected object is not 1024x1024.", true);
    const flutterProjectFolder = await fs.getFolder();
    if (!flutterProjectFolder) return;
    new AppIcon(item, flutterProjectFolder).export(platform);
}

function validateSize(item) {
    return Math.round(item.localBounds.width) != 1024 || Math.round(item.localBounds.height) != 1024;
}

module.exports = {
    exportAppIcon: exportAppIcon,
};
